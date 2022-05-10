const { verifyToken } = require("../helpers/auth");

const protectRoute = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Authentication failed.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = verifyToken(token);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Authentication failed.");
    error.statusCode = 401;
    throw error;
  }
  req.user = decodedToken;
  next();
};

module.exports = { protectRoute };
