import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went Wrong";

  const payLoad = {
    success: false,
    message,
  };

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    payLoad.errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already in use`;
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  logger.error({ err, method: req.method, Url: req.originalUrl }, message);

  payLoad.message = message;

  if (err.details) {
    payLoad.details = err.details;
  }

  if (process.env.NODE_ENV?.toLowerCase() === "development" && err.stack) {
    payLoad.stack = err.stack;
  }

  return res.status(statusCode).json(payLoad);
};

export default errorHandler;
