const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
// we don't have to require the Recipient model in here, as that's already required in Survey as a sub-document
require("./models/User");
require("./models/Survey");
require("./services/passport");

// connecting mongoose with mongo
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

// all these .use are Express middlewares, where the desired preprocessing occurs before they are sent to the route handlers

app.use(bodyParser.json());

app.use(
  cookieSession({
    // this is when the cookie should expire, i.e. after 30 days (it is in milliseconds)
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // this is used to encrypt the cookie
    keys: [keys.cookieKey],
  })
);

// this is telling passport to make use of cookies
app.use(passport.initialize());
app.use(passport.session());

// this is importing the file which returns a function, i.e. app, and we are immediately calling it
require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);
require("./routes/surveyRoutes")(app);

if (process.env.NODE_ENV === "production") {
  // telling Express to serve up production assets from the build folder
  app.use(express.static("client/build"));

  // this takes care of the routes that are not handled by Express, for e.g. the React routes
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
