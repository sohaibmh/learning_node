const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
});

// creating a new collection called users, it only creates new collections if it doesn't already exist
mongoose.model("users", userSchema);
