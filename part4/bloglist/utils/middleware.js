const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};
// Middleware to extract token from request headers
const tokenExtractor = (req, res, next) => {
  const auth = req.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    req.token = auth.replace("Bearer ", "");
  }
  next();
};

// Middleware to extract user from token
const userExtractor = async (req, res, next) => {
  if (!req.token) return next();

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = await User.findById(decodedToken.id);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
};

// Error handler middleware
const errorHandler = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "CastError") {
    return res.status(400).json({ error: "Malformatted ID" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  next(error);
};

// Middleware for handling unknown endpoints
const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
