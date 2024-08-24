const jwt = require("jsonwebtoken");
const { ADMIN_TOKEN_AGE } = require("../config/config");

module.exports.createTokenAdmin = async (user) => {
  let expiresIn = ADMIN_TOKEN_AGE;
  const token = await jwt.sign({ ...user._doc }, process.env.TOKEN_SECRET, {
    expiresIn,
  });
  return token;
};

