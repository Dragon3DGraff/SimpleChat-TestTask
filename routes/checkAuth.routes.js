const { Router } = require("express");
const router = Router();
const config = require("config");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  console.log('checkAuth');
  try {
    const sess = req.session;
    if (sess.username && sess.password) {
      if (sess.username) {
        console.log(sess.username);
        res.status(200).json({ userId, userName: sess.username });
      }
    }
    else {
      console.log("No authorization");
      return res.status(401).json({ message: "No authorization" });
    }
    return
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No authorization" });
    }

    const decoded = jwt.verify(token, config.get("jwtSecret"));
    if (!decoded.userId) {
      res.clearCookie("token");
      return res.status(400).json({ message: "User not found" });
    }
    const userId = decoded.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.clearCookie("token");
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ userId, userName: user.name });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
    console.log(error);
  }

  req.cookies;
});

module.exports = router;
