"use strict ";

const Customer = require("../models/customer");
const User = require("../models/user");

const { mongoose } = require("../configs/dbConnection");

module.exports = {
  list: async (req, res) => {
    let data;
    if (req.user.isAdmin) {
      data = await res.getModelList(Customer);
    } else {
      data = await res.getModelList(Customer, { _id: req.user._id });
    }

    res.status(200).send({
      error: false,
      message: "List of Customers",
      details: await res.getModelListDetails(Customer),
      data,
    });
  },

  create: async (req, res, next) => {
    const { name, email, userId } = req.body;

    if (!name || !email || !userId) {
      res.errorStatusCode = 400;
      return next(new Error("Please fill name, email and UserId"));
    }

    const user = await User.findById(userId);

    if (!user) {
      res.errorStatusCode = 404;
      return next(new Error("User not found"));
    }

    const customer = await Customer.create({
      ...req.body,
      departmentId: user.departmentId,
    });

    res.status(201).send({
      error: false,
      message: "Customer created successfully",
      data: customer,
    });
  },

  read: async (req, res) => {
    if (!req.params.id) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide Customer id"));
    }

    // ID kontrolü
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Customer id"));
    }

    const customer = await Customer.findOne({ _id: req.params.id });

    if (!customer) {
      res.errorStatusCode = 404;
      return next(new Error("Customer not found"));
    }

    res.status(200).send({
      error: false,
      message: "Customer listed successfully",
      data: customer,
    });
  },

  update: async (req, res) => {
    if (!req.params.id) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide Customer id"));
    }
    // ID kontrolü
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Customer id"));
    }

    const customer = await Customer.updateOne(
      { _id: req.params.id },
      req.body,
      {
        runValidators: true,
      }
    );

    if (!customer.modifiedCount) {
      res.errorStatusCode = 404;
      return next(new Error("Customer not updated"));
    }

    res.status(200).send({
      error: false,
      message: "Customer updated successfully",
      data: await Customer.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res, next) => {
    const CustomerId = req.params.id;

    // ID kontrolü
    if (!CustomerId || !mongoose.Types.ObjectId.isValid(CustomerId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Customer id"));
    }

    // Kullanıcıyı bul
    const customer = await Customer.findById(CustomerId);
    if (!customer) {
      res.errorStatusCode = 404;
      return next(new Error("Customer not found"));
    }

    // Kullanıcıyı sil
    const deleteResult = await Customer.deleteOne({ _id: CustomerId });

    if (!deleteResult.deletedCount) {
      res.errorStatusCode = 404;
      return next(new Error("Customer not deleted"));
    }

    res.status(200).send({
      error: false,
      message: "Customer deleted successfully",
    });
  },

  listCustomerByDepartment: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Department id"));
    }
    const customers = await Customer.find({ departmentId: req.params.id });
    res.status(200).send({
      error: false,
      message: "List of Customers",
      data: customers,
    });
  },
};
