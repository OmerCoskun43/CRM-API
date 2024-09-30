"use strict";

const router = require("express").Router();

const { sendMail } = require("../controllers/sendMail");

router.route("/").post(sendMail);

module.exports = router;
