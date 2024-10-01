"use strict";

const passwordEncrypt = require("../helpers/passwordEncrypt");
const Token = require("../models/token");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendMail = require("../helpers/sendMail");

module.exports = {
  login: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.errorStatusCode = 400;
      return next(new Error("Please fill email and password"));
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      res.errorStatusCode = 404;
      return next(new Error("User not found"));
    }

    if (user.password !== passwordEncrypt(password)) {
      res.errorStatusCode = 401;
      return next(new Error("Wrong password"));
    }

    let token = await Token.findOne({ userId: user._id });

    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isLead: user.isLead,
        isActive: user.isActive,
        departmentId: user.departmentId,
        profilePic: user.profilePic,
      },
      process.env.ACCESS_KEY,
      { expiresIn: "3m" }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.REFRESH_KEY,
      { expiresIn: "3d" }
    );
    if (!token) {
      token = await Token.create({
        userId: user._id,
        token: passwordEncrypt(`${new Date().getTime()}-${user._id}`),
      });
    }

    if (user.isAdmin) {
      sendMail({
        to: user.email,
        subject: "Giris Yapildi",
        html: `<h1>${user.name} adli kullanıcı oturum actı. Admin yetkisi ile oturum açıldı siz değilseniz IT departmanına başvurunuz.</h1>`,
      });
    }

    await User.findByIdAndUpdate(user._id, {
      isLoggedIn: true,
      lastLogin: new Date(),
    });

    res.status(200).send({
      error: false,
      message: "User logged in successfully",
      token: token.token,
      refreshToken,
      accessToken,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isLead: user.isLead,
        isActive: user.isActive,
        departmentId: user.departmentId,
        profilePic: user.profilePic,
        isLoggedIn: true,
      },
    });
  },
  logout: async (req, res, next) => {
    const auth = req.headers?.authorization; // Token ...tokenKey...
    const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...tokenKey...']
    // Kullanıcıya ait token'ı sil
    if (tokenKey[0] === "Token") {
      const deleteResult = await Token.deleteOne({ token: tokenKey[1] });

      if (deleteResult.deletedCount === 0) {
        res.errorStatusCode = 404;
        return next(new Error("Token not found or already deleted"));
      }
    }

    const decoded = jwt.verify(tokenKey[1], process.env.ACCESS_KEY);
    await User.findByIdAndUpdate(decoded._id, { isLoggedIn: false });

    res.status(200).send({
      error: false,
      message: "User logged out successfully and token deleted",
    });
  },

  refresh: async (req, res, next) => {
    const { refreshToken } = req.body;

    // Refresh token kontrolü
    if (!refreshToken) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide refresh token"));
    }

    // Refresh token'ı doğrulama
    jwt.verify(refreshToken, process.env.REFRESH_KEY, async (err, decoded) => {
      if (err) {
        res.errorStatusCode = 401;
        return next(new Error("Invalid refresh token"));
      }

      // Kullanıcıyı güncel veritabanı kaydından çek
      const user = await User.findById(decoded._id);

      if (!user) {
        res.errorStatusCode = 404;
        return next(new Error("User not found"));
      }

      // Yeni access token oluştur
      const accessToken = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          isLead: user.isLead,
          isActive: user.isActive,
          departmentId: user.departmentId,
        },
        process.env.ACCESS_KEY,
        { expiresIn: "30m" } // Access token 30 dakika geçerli
      );

      // Access token'ı döndür
      res.status(200).json({
        error: false,
        message: "Access token generated successfully",
        accessToken,
      });
    });
  },
};
