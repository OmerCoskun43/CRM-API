"use strict";

const mongoose = require("mongoose");
const MONGODB = process.env.MONGO_DB;

const dbConnection = () => {
  mongoose
    .connect(MONGODB)
    .then(() => {
      console.log("MongoDB connected successfully😀");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB 😪", err);
    });
};

module.exports = { dbConnection, mongoose };
