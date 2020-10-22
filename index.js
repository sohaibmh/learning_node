const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");

// connecting mongoose with mongo
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

// all these .use are middlewares, where the desired preprocessing occurs before they are sent to the route handlers
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

// this is importing the file which return a function, i.e. app, and we are immediately calling it
require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
