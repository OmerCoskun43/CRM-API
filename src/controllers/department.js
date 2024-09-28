"use strict";

const Department = require("../models/department");
const { mongoose } = require("../configs/dbConnection");

module.exports = {
  list: async (req, res) => {
    const departments = await res.getModelList(Department);
    res.status(200).send({
      error: false,
      message: "List of departments",
      details: await res.getModelListDetails(Department),
      data: departments,
    });
  },

  create: async (req, res, next) => {
    if (!req.body.name) {
      res.errorStatusCode = 400;
      return next(new Error("Please fill department name"));
    }
    const department = new Department(req.body);
    const result = await department.save();
    res.status(201).send({
      error: false,
      message: "Department created successfully",
      data: result,
    });
  },

  read: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide department id"));
    }
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.errorStatusCode = 404;
      return next(new Error("Department not found"));
    }
    res.status(200).send({
      error: false,
      message: "Department found",
      data: department,
    });
  },

  update: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide department id"));
    }
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!department) {
      res.errorStatusCode = 404;
      return next(new Error("Department not found"));
    }
    res.status(200).send({
      error: false,
      message: "Department updated successfully",
      data: department,
    });
  },

  delete: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide department id"));
    }
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      res.errorStatusCode = 404;
      return next(new Error("Department not found"));
    }
    res.status(200).send({
      error: false,
      message: "Department deleted successfully",
      data: department,
    });
  },
};
