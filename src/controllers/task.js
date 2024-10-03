"use strict";

const Task = require("../models/task");
const User = require("../models/user");
const Customer = require("../models/customer");
const { mongoose } = require("../configs/dbConnection");

module.exports = {
  list: async (req, res) => {
    const tasks = await res.getModelList(Task, {}, [
      { path: "customerId" },
      { path: "userId" },
    ]);
    res.status(200).send({
      error: false,
      message: "List of tasks",
      details: await res.getModelListDetails(Task),
      data: tasks,
    });
  },

  create: async (req, res, next) => {
    const { userId, customerId, taskDescription, dueDate } = req.body;
    if (!userId || !customerId || !taskDescription || !dueDate) {
      res.errorStatusCode = 400;
      return next(
        new Error("Please fill userId, customerId, taskDescription and dueDate")
      );
    }

    const user = await User.findById(userId);
    const customer = await Customer.findById(customerId);
    if (!user || !customer) {
      res.errorStatusCode = 404;
      return next(new Error("User or Customer not found"));
    }

    const newTask = await Task.create(req.body);
    res.status(201).send({
      error: false,
      message: "Task created successfully",
      data: newTask,
    });
  },

  read: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Task id"));
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.errorStatusCode = 404;
      return next(new Error("Task not found"));
    }

    res.status(200).send({
      error: false,
      message: "Task found",
      data: task,
    });
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Task id"));
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      res.errorStatusCode = 404;
      return next(new Error("Task not updated or not found"));
    }

    res.status(200).send({
      error: false,
      message: "Task updated successfully",
      data: updatedTask,
    });
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Task id"));
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      res.errorStatusCode = 404;
      return next(new Error("Task not found or already deleted"));
    }

    res.status(200).send({
      error: false,
      message: "Task deleted successfully",
      data: deletedTask,
    });
  },

  customerTasks: async (req, res, next) => {
    const { customerId } = req.params;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Customer id"));
    }

    const tasks = await res.getModelList(
      Task,
      {
        customerId,
      },
      [
        { path: "userId", select: "name email isAdmin isLead" },
        { path: "customerId", select: "name email" },
      ]
    );

    if (!tasks.length) {
      res.errorStatusCode = 404;
      return next(new Error("No tasks found for this customer"));
    }

    // Görevleri döndür
    res.status(200).send({
      error: false,
      message: "Tasks retrieved successfully",
      details: await res.getModelListDetails(Task, { customerId }),
      data: tasks,
    });
  },
  userTasks: async (req, res, next) => {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid User id"));
    }

    const tasks = await res.getModelList(
      Task,
      {
        userId,
      },
      [
        { path: "userId", select: "name email isAdmin isLead" },
        { path: "customerId", select: "name email" },
      ]
    );

    if (!tasks.length) {
      res.errorStatusCode = 404;
      return next(new Error("No tasks found for this user"));
    }

    res.status(200).send({
      error: false,
      message: "Tasks retrieved successfully",
      details: await res.getModelListDetails(Task, { userId }),
      data: tasks,
    });
  },
};
