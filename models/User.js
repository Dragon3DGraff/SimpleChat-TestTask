const { model, Schema } = require("mongoose");

const schema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  registered: { type: Date, default: Date.now },
  role: { type: String },
});

module.exports = model("User", schema);
