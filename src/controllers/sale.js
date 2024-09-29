"use strict";

const Sale = require("../models/sale");
const Product = require("../models/product");
const Customer = require("../models/customer");
const { mongoose } = require("../configs/dbConnection");

module.exports = {
  list: async (req, res) => {
    const sales = await res.getModelList(Sale, {}, "productId");

    if (!sales) {
      return res.status(404).send({
        error: true,
        message: "Sales not found",
      });
    }

    res.status(200).send({
      error: false,
      message: "List of sales",
      details: await res.getModelListDetails(Sale),
      data: sales,
    });
  },

  create: async (req, res, next) => {
    const { customerId, productId, quantity, price } = req.body;

    if (!customerId || !productId || !price || !quantity) {
      return res.status(400).send({
        error: true,
        message: "Missing required fields",
      });
    }

    const product = await Product.findById(productId);
    const customer = await Customer.findById(customerId);
    if (!product || !customer) {
      return res.status(404).send({
        error: true,
        message: "Product or customer not found",
      });
    }

    if (product.stockQuantity < quantity) {
      res.errorStatusCode = 400;
      return next(new Error("Insufficient stock quantity"));
    }

    product.stockQuantity -= quantity;
    await product.save();

    const totalProfit = price * quantity - product.price * quantity;
    const sale = await Sale.create({ ...req.body, totalProfit });

    res.status(201).send({
      error: false,
      message: "Sale created successfully",
      data: sale,
    });
  },

  read: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Sale id"));
    }

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      res.errorStatusCode = 404;
      return next(new Error("Sale not found"));
    }

    res.status(200).send({
      error: false,
      message: "Sale found",
      data: sale,
    });
  },

  update: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Sale id"));
    }

    const { quantity, price } = req.body;

    if (!price || !quantity) {
      return res.status(400).send({
        error: true,
        message: "Missing required fields",
      });
    }

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      res.errorStatusCode = 404;
      return next(new Error("Sale not found"));
    }

    const product = await Product.findById(sale.productId);
    if (!product) {
      res.errorStatusCode = 404;
      return next(new Error("Product not found"));
    }

    const difference = quantity - sale.quantity;

    if (difference > 0) {
      if (product.stockQuantity < difference) {
        res.errorStatusCode = 400;
        return next(new Error("Insufficient stock quantity"));
      }
      product.stockQuantity -= difference;
    } else {
      product.stockQuantity += Math.abs(difference);
    }

    await product.save();

    const totalProfit = price * quantity - product.price * quantity;

    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      { ...req.body, totalProfit },
      { new: true, runValidators: true }
    );

    if (!updatedSale) {
      res.errorStatusCode = 404;
      return next(new Error("Sale not updated"));
    }

    res.status(200).send({
      error: false,
      message: "Sale updated successfully",
      data: updatedSale,
    });
  },

  delete: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Sale id"));
    }

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      res.errorStatusCode = 404;
      return next(new Error("Sale not found"));
    }

    const product = await Product.findById(sale.productId);
    if (product) {
      product.stockQuantity += sale.quantity; // Stok geri yükleniyor
      await product.save();
    }

    await Sale.findByIdAndDelete(req.params.id);

    res.status(200).send({
      error: false,
      message: "Sale deleted successfully",
    });
  },

  totalProfit: async (req, res, next) => {
    const totalProfit = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$totalProfit" },
        },
      },
    ]);

    if (!totalProfit) {
      res.errorStatusCode = 404;
      return next(new Error("Total profit not found"));
    }

    res.status(200).send({
      error: false,
      message: "Total profit found",
      totalProfit,
    });
  },
  totalProfitByCategory: async (req, res, next) => {
    const categoryId = req.params.id; // Kategori ID'sini parametre olarak al
    console.log("categoryId :>> ", categoryId);

    // Kategoriye göre toplam kar hesaplama
    const totalProfit = await Sale.aggregate([
      {
        $lookup: {
          from: "products", // Product modelinin koleksiyon adı
          localField: "productId",
          foreignField: "_id",
          as: "productDetails", // Ürün detaylarını almak için bir alan
        },
      },
      {
        $unwind: "$productDetails", // Ürün detaylarını aç
      },
      {
        $lookup: {
          from: "categories", // Kategori modelinin koleksiyon adı
          localField: "productDetails.categoryId",
          foreignField: "_id",
          as: "categoryDetails", // Kategori detaylarını almak için bir alan
        },
      },
      {
        $unwind: "$categoryDetails", // Kategori detaylarını aç
      },
      {
        $match: {
          "productDetails.categoryId": new mongoose.Types.ObjectId(categoryId), // Kategori ID'sine göre filtreleme
        },
      },
      {
        $group: {
          _id: "$categoryDetails._id", // Kategori ID'sine göre gruplama
          categoryName: { $first: "$categoryDetails.name" }, // Kategori adını al
          totalProfit: { $sum: "$totalProfit" }, // Toplam kar hesaplama
        },
      },
    ]);

    if (!totalProfit || totalProfit.length === 0) {
      res.errorStatusCode = 404;
      return next(new Error("Total profit not found for this category"));
    }

    res.status(200).send({
      error: false,
      message: "Total profit found for the category",
      data: totalProfit,
    });
  },
};
