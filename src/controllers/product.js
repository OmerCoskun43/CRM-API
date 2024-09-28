"use strict ";

const Product = require("../models/product");
const Category = require("../models/category");
const { mongoose } = require("../configs/dbConnection");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Product);

    res.status(200).send({
      error: false,
      message: "List of Products",
      details: await res.getModelListDetails(Product),
      data,
    });
  },

  create: async (req, res, next) => {
    const { name, description, price, stockQuantity, categoryId } = req.body;

    if (!name || !description || !price || !stockQuantity || !categoryId) {
      res.errorStatusCode = 400;
      return next(
        new Error(
          "Please fill name,  description, price, stockQuantity and categoryId"
        )
      );
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      res.errorStatusCode = 404;
      return next(new Error("Category not found"));
    }

    const product = await Product.create(req.body);

    res.status(201).send({
      error: false,
      message: "Product created successfully",
      data: product,
    });
  },

  read: async (req, res) => {
    if (!req.params.id) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide Product id"));
    }

    // ID kontrolü
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Product id"));
    }

    const product = await Product.findOne({ _id: req.params.id });

    if (!Product) {
      res.errorStatusCode = 404;
      return next(new Error("Product not found"));
    }

    res.status(200).send({
      error: false,
      message: "Product listed successfully",
      data: product,
    });
  },

  update: async (req, res) => {
    if (!req.params.id) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide Product id"));
    }
    // ID kontrolü
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Product id"));
    }

    const product = await Product.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    if (!product.modifiedCount) {
      res.errorStatusCode = 404;
      return next(new Error("Product not updated"));
    }

    res.status(200).send({
      error: false,
      message: "Product updated successfully",
      data: await Product.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res, next) => {
    const ProductId = req.params.id;

    // ID kontrolü
    if (!ProductId || !mongoose.Types.ObjectId.isValid(ProductId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Product id"));
    }

    // Kullanıcıyı bul
    const product = await Product.findById(ProductId);
    if (!product) {
      res.errorStatusCode = 404;
      return next(new Error("Product not found"));
    }

    // Kullanıcıyı sil
    const deleteResult = await Product.deleteOne({ _id: ProductId });

    if (!deleteResult.deletedCount) {
      res.errorStatusCode = 404;
      return next(new Error("Product not deleted"));
    }

    res.status(200).send({
      error: false,
      message: "Product deleted successfully",
    });
  },
};
