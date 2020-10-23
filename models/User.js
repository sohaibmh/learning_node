const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  // for the credits field, in addition to saying what type the data is going to be, we also want it to be 0 by default,
  // hence using an object to declare these properties, check the mongoose documentation for further such properties
  credits: { type: Number, default: 0 },
});

// creating a new collection called users, it only creates new collections if it doesn't already exist
mongoose.model("users", userSchema);
