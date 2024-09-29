"use strict";
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("express-async-errors");

//! CORS
app.use(cors());

//! ENV VARIABLES
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

//! DB CONNECTION
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

//! MIDDLEWARES
// URL encoded middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

//? LOGGER
// app.use(require("./src/middlewares/logger"));
//? JSON verilerini işlemek için yerleşik middleware

//? AUTHENTICATION
app.use(require("./src/middlewares/authentication"));

//? Paginiation
app.use(require("./src/middlewares/findSearchSortPage"));

//! ROUTES

app.all("/", (req, res) => {
  res.send({
    Project: "Crm API",
    Created: "Omer Coskun",
    Status: "Working",
    Version: "1.0.0",
    user: req.user || false,
  });
});

app.use("/api", require("./src/routes"));

// Static Files:
app.use("/uploads", express.static("./uploads"));

//! Error Handler
app.use(require("./src/middlewares/errorHandler"));

//! CREATE SERVER
app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
