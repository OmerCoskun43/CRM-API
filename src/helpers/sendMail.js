"use strict";

const nodemailer = require("nodemailer");

// Gmail ile e-posta göndermek için Nodemailer ayarları
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail adresinizi buraya yazın
    pass: process.env.EMAIL_PASS, // Gmail şifrenizi buraya yazın (2FA varsa uygulama şifresi kullanın)
  },
});

// E-posta gönderimi
module.exports = ({ to, subject, html }) => {
  transporter.sendMail(
    { from: process.env.EMAIL_USER, to, subject, html },
    (error, info) => {
      if (error) {
        console.log("E-posta gönderimi başarısız:", error);
      } else {
        console.log("E-posta gönderildi: " + info.response);
      }
    }
  );
};
