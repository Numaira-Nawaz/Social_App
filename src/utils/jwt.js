let jwt = require("jsonwebtoken");

module.exports = async function generateToken(user) {
  //console.log("Userd----------------:", user);
  return await jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30 days",
    }
  );
};
