module.exports = (req, res, next) => {
  // checks if the user is logged in
  if (!req.user) {
    return res.status(401).send({ error: "You must login!" });
  }

  // only if the user is logged in execute the function, in this case this would be the next middleware
  next();
};
