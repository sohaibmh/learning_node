const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");

// fetching the user model that we created in User.js file;
// giving it one argument means we want to fetch the model, two arguments means we want to create a model
// this allows us to use the model class and create a model instance so we can save it in the database
const User = mongoose.model("users");

// the following two functions are used to encode the user's id inside the cookie
// this passport function is used to create a cookie/token
// the user is the same that is passed in the done function inside the passport.use function
passport.serializeUser((user, done) => {
  // the user.id is not referring to the googleID but rather the id that mongo creates for every entry
  done(null, user.id);
});

// the id is the user.id that we passed in the done function inside the passport.serializeUser function
passport.deserializeUser((id, done) => {
  // looking into the mongo the database for the user
  // remember each time we take something from the database it is async so we have to chain it in .then
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      // this checks whether a user already exists, it returns a promise
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          console.log("user already exists");
          // done is called whenever the process is completed, it takes two arguments, the first is for error, the second is.. the current user
          done(null, existingUser);
        } else {
          // creating an instance (i.e. a new user); the .save() saves it in the database
          // done is called inside .then because saving in the database is asynchronous
          new User({ googleId: profile.id })
            .save()
            .then((user) => done(null, user));
        }
      });
    }
  )
);
