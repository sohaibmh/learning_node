const passport = require("passport");

module.exports = (app) => {
  // these are the route handlers

  // this is dealing with the get request that is made to the url
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/surveys");
    }
  );

  app.get("/api/logout", (req, res) => {
    // this expires the cookie
    req.logout();
    // sends back the user to the home page following log out
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
