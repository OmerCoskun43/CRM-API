"use strict";

const sendMail = require("../helpers/sendMail");

module.exports = {
  sendMail: (req, res) => {
    sendMail(req.body);

    res.status(200).send({ error: false, message: "Mail sent successfully" });
  },
};
