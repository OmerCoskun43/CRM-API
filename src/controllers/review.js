"use strict";

const Review = require("../models/review");
const User = require("../models/user");
const Product = require("../models/product");
const { mongoose } = require("../configs/dbConnection");

module.exports = {
  list: async (req, res) => {
    const reviews = await res.getModelList(Review, {}, [
      { path: "productId", select: "name" }, // Ürün adını döndür
      { path: "userId", select: "name email" }, // Kullanıcı bilgilerini döndür
    ]);

    res.status(200).send({
      error: false,
      message: "List of reviews",
      details: await res.getModelListDetails(Review),
      data: reviews,
    });
  },

  create: async (req, res, next) => {
    const { userId, productId, rating } = req.body;

    if (!userId || !productId || !rating) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide userId, productId, and rating"));
    }

    // Kullanıcıyı kontrol et
    const user = await User.findById(userId);
    if (!user) {
      res.errorStatusCode = 404;
      return next(new Error("User not found"));
    }

    // Ürünü kontrol et
    const product = await Product.findById(productId);
    if (!product) {
      res.errorStatusCode = 404;
      return next(new Error("Product not found"));
    }

    const newReview = await Review.create(req.body);
    res.status(201).send({
      error: false,
      message: "Review created successfully",
      data: newReview,
    });
  },
  read: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Review id"));
    }

    const review = await Review.findById(req.params.id).populate(
      "productId userId"
    );

    if (!review) {
      res.errorStatusCode = 404;
      return next(new Error("Review not found"));
    }

    res.status(200).send({
      error: false,
      message: "Review found",
      data: review,
    });
  },

  update: async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Review id"));
    }

    const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReview) {
      res.errorStatusCode = 404;
      return next(new Error("Review not updated or not found"));
    }

    res.status(200).send({
      error: false,
      message: "Review updated successfully",
      data: updatedReview,
    });
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Review id"));
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      res.errorStatusCode = 404;
      return next(new Error("Review not found or already deleted"));
    }

    res.status(200).send({
      error: false,
      message: "Review deleted successfully",
      data: deletedReview,
    });
  },

  productReviews: async (req, res, next) => {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Product id"));
    }

    const reviews = await res.getModelList(Review, { productId }, [
      { path: "userId", select: "name email" },
    ]);

    if (!reviews.length) {
      res.errorStatusCode = 404;
      return next(new Error("No reviews found for this product"));
    }

    res.status(200).send({
      error: false,
      message: "Reviews retrieved successfully",
      details: await res.getModelListDetails(Review, { productId }),
      data: reviews,
    });
  },

  userReviews: async (req, res, next) => {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid User id"));
    }

    const reviews = await res.getModelList(Review, { userId }, [
      { path: "productId", select: "name" },
    ]);

    if (!reviews.length) {
      res.errorStatusCode = 404;
      return next(new Error("No reviews found for this user"));
    }

    res.status(200).send({
      error: false,
      message: "Reviews retrieved successfully",
      details: await res.getModelListDetails(Review, { userId }),
      data: reviews,
    });
  },
};
