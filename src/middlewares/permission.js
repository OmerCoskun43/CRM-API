"use strict";

module.exports = {
  isLogin: (req, res, next) => {
    if (req.user && req.user.isActive) {
      next();
    } else {
      res.status(403).send({
        error: true,
        message: "You are not authorized. You should be logged in",
      });
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.isActive && req.user.isAdmin) {
      next();
    } else {
      res.status(403).send({
        error: true,
        message: "You are not authorized. You should be an admin",
      });
    }
  },

  isLead: (req, res, next) => {
    if (req.user && req.user.isActive && req.user.isLead) {
      next();
    } else {
      res.status(403).send({
        error: true,
        message: "You are not authorized. You should be a lead",
      });
    }
  },

  isLeadOrAdmin: (req, res, next) => {
    if (
      req.user &&
      req.user.isActive &&
      (req.user.isAdmin ||
        (req.user.isLead && req.user.departmentId === req.params.id))
    ) {
      next();
    } else {
      res.status(403).send({
        error: true,
        message: "You are not authorized. You should be a lead or admin",
      });
    }
  },

  isSelfOrAdmin: (req, res, next) => {
    if (
      req.user &&
      req.user.isActive &&
      (req.user.isAdmin || req.user._id.toString() === req.params.id)
    ) {
      next();
    } else {
      res.status(403).send({
        error: true,
        message: "You are not authorized. You should be an admin or yourself",
      });
    }
  },

  isSelfOrLead: (req, res, next) => {
    if (
      req.user &&
      req.user.isActive &&
      (req.user.isLead || req.user._id.toString() === req.params.id)
    ) {
      next();
    } else {
      res.status(403).send({
        error: true,
        message: "You are not authorized. You should be a lead or yourself",
      });
    }
  },
};
