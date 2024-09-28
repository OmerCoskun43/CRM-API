"use strict";

const Token = require("../models/token");

const mongoose = require("mongoose");

module.exports = {
  list: async (req, res) => {
    const tokens = await res.getModelList(Token);

    res.status(200).send({
      error: false,
      message: "List of tokens",
      details: await res.getModelListDetails(Token),
      data: tokens,
    });
  },

  create: async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
      res.errorStatusCode = 400;
      return next(new Error("Please fill userId "));
    }

    const user = await User.findById(userId);
    if (!user) {
      res.errorStatusCode = 404;
      return next(new Error("User not found"));
    }

    const newToken = await Token.create({
      userId,
      token: `${new Date().getTime()}-${userId}`,
    });

    res.status(201).send({
      error: false,
      message: "Token created successfully",
      data: newToken,
    });
  },

  read: async (req, res, next) => {
    if (!req.params.id) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide token id"));
    }
    const tokenId = req.params.id;

    // ID kontrolü
    if (!tokenId || !mongoose.Types.ObjectId.isValid(tokenId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Token id"));
    }

    const token = await Token.findById(req.params.id).populate("userId");

    if (!token) {
      res.errorStatusCode = 404;
      return next(new Error("Token not found"));
    }

    res.status(200).send({
      error: false,
      message: "Token listed successfully",
      data: token,
    });
  },

  update: async (req, res, next) => {
    if (!req.params.id) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide token id"));
    }
    const tokenId = req.params.id;

    // ID kontrolü
    if (!tokenId || !mongoose.Types.ObjectId.isValid(tokenId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Token id"));
    }

    const updatedToken = await Token.updateOne(
      { _id: req.params.id },
      req.body
    );

    if (!updatedToken.modifiedCount) {
      res.errorStatusCode = 404;
      return next(new Error("Token not updated"));
    }

    res.status(200).send({
      error: false,
      message: "Token updated successfully",
      data: await Token.findById(req.params.id).populate("userId"),
    });
  },

  delete: async (req, res, next) => {
    const tokenId = req.params.id;

    // ID kontrolü
    if (!tokenId || !mongoose.Types.ObjectId.isValid(tokenId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Token id"));
    }

    // Token'ı bul
    const token = await Token.findById(tokenId);
    if (!token) {
      res.errorStatusCode = 404;
      return next(new Error("Token not found"));
    }

    // Token'ı sil
    const deleteResult = await Token.deleteOne({ _id: tokenId });

    if (!deleteResult.deletedCount) {
      res.errorStatusCode = 404;
      return next(new Error("Token not deleted"));
    }

    res.status(200).send({
      error: false,
      message: "Token deleted successfully",
    });
  },
};
