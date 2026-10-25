// ---- ApiError

class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.statusCode = status;
    this.details = details;
    this.operational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
