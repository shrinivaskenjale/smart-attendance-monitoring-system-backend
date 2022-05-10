const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

const verifyPasswords = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

const generateToken = (data) => {
  const token = jwt.sign(data, process.env.TOKEN_HASH_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const verifyToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.TOKEN_HASH_SECRET);
  return decodedToken;
};

module.exports = {
  hashPassword,
  verifyPasswords,
  generateToken,
  verifyToken,
};

// hashPassword("admin").then((pw) => console.log(pw));
