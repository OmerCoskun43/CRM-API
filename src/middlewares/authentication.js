"use strict";

const Token = require("../models/token");
const jwt = require("jsonwebtoken");

const authenticateToken = (token) => {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.ACCESS_KEY, (error, accessData) => {
      if (error) {
        // Hata durumunda false döndür
        return resolve(false);
      }
      resolve({
        ...accessData,
        iat: new Date(accessData.iat * 1000)
          .toISOString()
          .slice(0, 16)
          .replace("T", " "),
        exp: new Date(accessData.exp * 1000)
          .toISOString()
          .slice(0, 16)
          .replace("T", " "),
      });
    });
  });
};

module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization; // Token ...tokenKey...
  const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...tokenKey...']

  if (!tokenKey) {
    req.user = false; // Authorization header yoksa kullanıcı false
    return next();
  }

  if (tokenKey[0] === "Token") {
    const tokenData = await Token.findOne({ token: tokenKey[1] }).populate(
      "userId"
    );
    req.user = tokenData
      ? {
          _id: tokenData.userId._id,
          name: tokenData.userId.name,
          email: tokenData.userId.email,
          isAdmin: tokenData.userId.isAdmin,
          isLead: tokenData.userId.isLead,
          isActive: tokenData.userId.isActive,
          departmentId: tokenData.userId.departmentId,
          token: tokenData.token,
        }
      : false;
  } else if (tokenKey[0] === "Bearer") {
    req.user = await authenticateToken(tokenKey[1]);
  } else {
    req.user = false; // Geçersiz token türü durumunda kullanıcı false
  }

  next(); // Her durumda next() çağrılır
};
