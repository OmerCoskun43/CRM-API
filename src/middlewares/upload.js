"use strict";

const multer = require("multer");
const path = require("path");

// Multer'ı yapılandır
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Dosyaların kaydedileceği klasör
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Dosya adını zaman damgası ile değiştir
  },
});

module.exports = multer({ storage });
