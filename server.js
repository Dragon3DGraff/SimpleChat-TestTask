const express = require("express");
const config = require("config");
const app = express();
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const winston = require('winston');
const expressWinston = require('express-winston');
// const cookieParser = require("cookie-parser");
const session = require('express-session');
const { createClient } = require('redis')
const connectRedis = require('connect-redis');
const bodyParser = require('body-parser')
// const app = require("https-localhost")()
// var https = require('https');
// var fs = require('fs')

const chatRooms = new Map();
chatRooms.set("Default room", {
  users: [],
  messages: [],
});

app.set('trust proxy', 1);
const redisClient = createClient();
const RedisStore = connectRedis(session)

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', function (err) {
  console.log('Connected to redis successfully');
});

redisClient.connect();

// app.use(cookieParser());
// app.use(bodyParser.json())

app.use(express.json());
app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
  format: winston.format.combine(
    // winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: "HTTP ",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'secret$%^134',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie 
    maxAge: 1000 * 60 * 10 // session max age in miliseconds
  }
}))


app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/checkAuth", require("./routes/checkAuth.routes"));



// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
//   });

const PORT = config.get("port") || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoURI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    });

    let server = app.listen(PORT, () => console.log(`Started at ${PORT}`));




    // let server = https.createServer({
    // 	key: fs.readFileSync('87221199_httpsmy-app.loca.lt.key'),
    // 	cert: fs.readFileSync('87221199_httpsmy-app.loca.lt.cert')
    //   }, app)
    //   .listen(PORT, function () {
    // 	console.log('Example app listening on port 3000! Go to https://localhost:3000/')
    //   })

    // let io = require("socket.io").listen(server);
    // let io = require("socket.io")(server, {
    //   allowEIO3: true, // false by default
    //   cors: {
    //     origin: "http://localhost:3000/",
    //     methods: ["GET", "POST"],
    //     credentials: true
    //   }
    // });
    const io = new Server(server, {
      // allowEIO3: true, // false by default
      cors: {
        origin: "http://localhost:3000",
        // methods: ["GET", "POST"],
        credentials: true
      }
    });

    //get list of all rooms
    app.get("/rooms", (req, res) => {
      let roomsObj = { rooms: [...chatRooms.keys()] };
      res.json(roomsObj);
    });

    // preparing for production
    if (process.env.NODE_ENV === "production") {
      app.use("/", express.static(path.join(__dirname, "client", "build")));

      app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
      });
    }

    //Create new room
    app.post("/rooms", (req, res) => {
      const { author, nameOfRoom } = req.body;
      if (!chatRooms.has(nameOfRoom)) {
        chatRooms.set(nameOfRoom, {
          users: [],
          messages: [],
        });
        res.send(`Room ${nameOfRoom} created`);
      } else {
        res.send("Choose another name");
      }
    });

    io.on("connection", (socket) => {
      socket.on("room created", (nameOfRoom) => {
        io.emit("room created", nameOfRoom);
      });
    });

    //when user connected to room send him all users and messages
    io.on("connection", (socket) => {
      socket.on("user connected", (roomName, author) => {
        chatRooms.get(roomName).users.push({ id: socket.id, name: author });
        socket.join(roomName);
        io.sockets.to(roomName).emit("user connected", {
          users: chatRooms.get(roomName).users,
          messages: chatRooms.get(roomName).messages,
        });
      });
    });

    //get massages from room and sent them to all users of this room
    io.on("connection", (socket) => {
      socket.on("chat message", (roomName, msg) => {
        socket.join(roomName);
        chatRooms.get(roomName).messages.push(msg);
        io.sockets
          .to(roomName)
          .emit("chat message", chatRooms.get(roomName).messages);
      });
    });

    //webRTC - Video
    io.on("connection", (socket) => {
      socket.on("call-users", (data) => {
        socket.join(data.roomName);
        socket.to(data.roomName).emit("call-made", data);
      });

      socket.on("initiate call", (data) => {
        socket.join(data.roomName);
        socket.to(data.roomName).emit("call initiated", data);
      });

      socket.on("got description", (data) => {
        socket.join(data.roomName);
        socket.to(data.roomName).to(data["dest"]).emit("got description", data);
      });

      socket.on("iceCandidate", (data) => {
        socket.join(data.roomName);
        socket.to(data.roomName).emit("goticeCandidate", data);
      });
    });

    //when user close browser delete him from all rooms
    io.on("connection", (socket) => {
      socket.on("disconnect", () => {
        //delete user from all chats
        chatRooms.forEach((room, roomName) => {
          room.users.map((user, index, array) => {
            if (user.id === socket.id) {
              array.splice(index, 1);
            }
          });
          io.emit("user connected", {
            users: chatRooms.get(roomName).users,
            messages: chatRooms.get(roomName).messages,
          });
        });
      });
    });
  } catch (e) {
    console.log("Server error", e.message);
    process.exit(1);
  }
}

start();

// lt --port 3000 --subdomain my-app --local-host localhost
