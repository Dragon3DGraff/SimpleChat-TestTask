const express = require('express');
const config = require('config');
const app = express();

const chatRooms = new Map();
chatRooms.set('Default room', {
	users: [],
	messages: []
})

app.use(express.json());

const PORT = config.get('port' ) || 5000

async function start() {
	try {

		let server = app.listen(PORT, () => console.log(`Started at ${PORT}`));
		let io = require('socket.io').listen(server);

		//get list of all rooms
		app.get('/rooms/', (req, res) => {
			let roomsObj = {rooms: [...chatRooms.keys()]};
			res.json(roomsObj);
		});

		// preparing for production
		if (process.env.NODE_ENV === 'production') {
			app.use('/', express.static(path.join(__dirname, 'client', 'build')))
			
			app.get('*', (req, res) => {
				res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
			})
		}

		//Create new room
		app.post('/rooms', (req, res) => {
			const {author, nameOfRoom} = req.body;
			if (!chatRooms.has(nameOfRoom)) {
				chatRooms.set(nameOfRoom, {
					users: [],
					messages: []
				})
				res.send(`Room ${nameOfRoom} created`);
			} else {
				res.send("Choose another name");
			}
		})

		io.on('connection', (socket) => {
			socket.on('room created', (nameOfRoom) => {
				io.emit('room created', nameOfRoom);
			} );
		  });

		io.on('connection', (socket) => {
		socket.on('user connected', (roomName, author) => {
			chatRooms.get(roomName).users.push({id: socket.id, name: author});
			socket.join(roomName);
			io.sockets.to(roomName).emit('user connected', {
				users: chatRooms.get(roomName).users,
				messages: chatRooms.get(roomName).messages
			});
		});
		});

		io.on('connection', (socket) => {
			socket.on('chat message', ( roomName, msg ) => {
				socket.join(roomName);
				chatRooms.get(roomName).messages.push(msg);
				io.sockets.to(roomName).emit('chat message', chatRooms.get(roomName).messages);
			});
		});

		io.on('connection', (socket) => {
			socket.on('disconnect', () => {
				//delete user from all chats
				chatRooms.forEach( (room, roomName) => {
					room.users.map((user, index, array) => {
						if( user.id === socket.id){
							array.splice(index, 1);
						}
					})
					io.emit('user connected', {
						users: chatRooms.get(roomName).users,
						messages: chatRooms.get(roomName).messages
					});
				});
			});
		});
	} catch (e) {
		console.log('Server error', e.message);
		process.exit(1);
	}
}

start();