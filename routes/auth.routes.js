const { Router } = require("express");
const router = Router();
const config = require("config");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

router.post(
  "/register",
  [
    // check("name", "Enter name").exists(),
    check("email", "Incorrect email").isEmail(),
    check("password", "Min password length is 6 symbols").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(200).json({
          errors: errors.array(),
          message: "Неверно заполнена форма",
        });
      }
      const { name, email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(200).json({ errors: [{ param: 'email' }], message: "Пользователь уже зарегистрирован" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "Account created!" });
    } catch (error) {
      res.status(500).json({ message: "ERROR" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Incorrect email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect registration data",
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      res.clearCookie("token");
      res.cookie("token", token, { httpOnly: true });

      res.json({ userId: user.id, userName: user.name });
    } catch (error) {
      res.status(500).json({ message: "ERROR" });
      console.log(error);
    }
  }
);

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ userId: undefined, userName: undefined });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

module.exports = router;
