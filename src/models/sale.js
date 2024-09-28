"use strict";

const { mongoose } = require("../configs/dbConnection");

const SaleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    saleDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0, // Başlangıçta 0
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["credit_card", "debit_card", "paypal", "cash"],
      default: "credit_card",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
    totalProfit: {
      type: Number,
      required: true,
      min: 0,
      default: 0, // Başlangıçta 0
    },
  },
  {
    timestamps: true,
    collection: "sales",
  }
);

// Kayıt oluşturulurken totalPrice hesaplama
SaleSchema.pre("save", function (next) {
  this.totalPrice = this.quantity * this.price;
  next();
});

// Güncellemelerde totalPrice hesaplama
SaleSchema.pre(
  ["findByIdAndUpdate", "updateOne", "findOneAndUpdate"],
  function (next) {
    const update = this.getUpdate();

    if (update.quantity || update.price) {
      const quantity =
        update.quantity !== undefined
          ? update.quantity
          : this.getQuery().quantity;
      const price =
        update.price !== undefined ? update.price : this.getQuery().price;

      update.totalPrice = quantity * price;
    }

    next();
  }
);

const Sale = mongoose.model("Sale", SaleSchema);
module.exports = Sale;
