"use strict";

module.exports = (err, req, res, next) => {
  const errorStatusCode = res.errorStatusCode || err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  res.status(errorStatusCode).send({
    error: true,
    status: errorStatusCode,
    message: errorMessage,
    stack: err.stack,
  });
};
