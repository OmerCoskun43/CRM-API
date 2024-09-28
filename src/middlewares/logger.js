"use strict";

const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const today = new Date().toISOString().split("T")[0];
const logFileName = `${today}.log`;
const accessLogStream = fs.createWriteStream(path.join("./logs", logFileName), {
  flags: "a+",
});

// Morgan'ı kullanarak detaylı loglama
const customFormat = `[DATE]: [:date[clf]] [REMOTE ADDRESS]: :remote-addr - [REQUEST]: ":method :url" [STATUS]: :status [RESPONSE TIME]: :response-time ms - [CONTENT LENGTH]: :res[content-length] bytes`;

module.exports = morgan(customFormat, { stream: accessLogStream });
