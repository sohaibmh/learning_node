const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  // the second parameter, which is the function that checks whether the user is logged in or not, is not invoked because in that case
  // it would run as soon as it it's loaded, but now Express only runs it when there's a request to the route
  // the request to charge by using the Stripe api returns a promise, hence the third parameter function is used asynchronously
  // the number of parameters that we add doesn't really matter, the only thing that matters to Express is that at least one of the functions must return a response to the user
  app.post("/api/stripe", requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "Charging for five credits",
      // the req.body is from body-parser package, which parses the request before sending it the route handler and makes it available as req.body
      // this is reference of the card that is being charged
      source: req.body.id,
    });

    // this is the mongo user model that we have set up,
    // we can access it as below, this is setup by passport in the index file (passport.initialize()...)
    req.user.credits += 5;
    // we always have to save the data whenever we make an entry to the database
    const user = await req.user.save();

    // this is sending the updated response to the browser
    res.send(user);

    console.log("charge ", charge);
  });
};
