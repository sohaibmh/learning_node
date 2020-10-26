const mongoose = require("mongoose");
const { Schema } = mongoose;
const RecipientSchema = require("./Recipient");

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  // this means recipients will be an array of RecipientSchema, essentially a sub-document
  recipients: [RecipientSchema],
  // these refer to the responses from the survey, i.e., do you like our product?
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  // this sets a relationship between user and survey, i.e. every survey will belong to a particular user
  // the underscore before user is not really required, but it's a convention to include it for relationships
  _user: { type: Schema.Types.ObjectId, ref: "User" },
  dateSent: Date,
  lastResponded: Date,
});

mongoose.model("surveys", surveySchema);
