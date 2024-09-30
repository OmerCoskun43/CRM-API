"use strict";
const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/tokens", require("./token"));
router.use("/departments", require("./department"));
router.use("/mails", require("./sendMail"));
router.use("/products", require("./product"));
router.use("/tasks", require("./task"));
router.use("/notes", require("./note"));
router.use("/events", require("./event"));
router.use("/reviews", require("./review"));
router.use("/sales", require("./sale"));
router.use("/categories", require("./category"));
router.use("/customers", require("./customer"));
router.use("/users", require("./user"));

module.exports = router;
