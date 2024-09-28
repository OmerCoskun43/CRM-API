"use strict";

const router = require("express").Router();

const { login, logout, refresh } = require("../controllers/auth");

router.route("/login").post(login);
router.route("/refresh").post(refresh);
router.route("/logout").get(logout);

module.exports = router;
