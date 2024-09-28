"use strict";

const Category = require("../models/category");
const { mongoose } = require("../configs/dbConnection");

module.exports = {
  list: async (req, res) => {
    const categories = await res.getModelList(Category);

    res.status(200).send({
      error: false,
      message: "List of categories",
      details: await res.getModelListDetails(Category),
      data: categories,
    });
  },

  create: async (req, res, next) => {
    if (!req.body.name) {
      res.errorStatusCode = 400;
      return next(new Error("Please fill category name"));
    }
    const newCategory = await Category.create(req.body);

    res.status(201).send({
      error: false,
      message: "Category created successfully",
      data: newCategory,
    });
  },

  read: async (req, res, next) => {
    if (!req.params.id) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide Category id"));
    }
    const CategoryId = req.params.id;

    // ID kontrolü
    if (!CategoryId || !mongoose.Types.ObjectId.isValid(CategoryId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Category id"));
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      res.errorStatusCode = 404;
      return next(new Error("Category not found"));
    }

    res.status(200).send({
      error: false,
      message: "Category listed successfully",
      data: cachesategory,
    });
  },

  update: async (req, res, next) => {
    if (!req.params.id) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide Category id"));
    }
    const CategoryId = req.params.id;

    // ID kontrolü
    if (!CategoryId || !mongoose.Types.ObjectId.isValid(CategoryId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Category id"));
    }

    const updatedCategory = await Category.updateOne(
      { _id: req.params.id },
      req.body
    );

    if (!updatedCategory.modifiedCount) {
      res.errorStatusCode = 404;
      return next(new Error("Category not updated"));
    }

    res.status(200).send({
      error: false,
      message: "Category updated successfully",
      data: await Category.findById(req.params.id),
    });
  },

  delete: async (req, res, next) => {
    const CategoryId = req.params.id;

    // ID kontrolü
    if (!CategoryId || !mongoose.Types.ObjectId.isValid(CategoryId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Category id"));
    }

    // Category'ı bul
    const category = await Category.findById(CategoryId);
    if (!category) {
      res.errorStatusCode = 404;
      return next(new Error("Category not found"));
    }

    // Category'ı sil
    const deleteResult = await Category.deleteOne({ _id: CategoryId });

    if (!deleteResult.deletedCount) {
      res.errorStatusCode = 404;
      return next(new Error("Category not deleted"));
    }

    res.status(200).send({
      error: false,
      message: "Category deleted successfully",
    });
  },
};
