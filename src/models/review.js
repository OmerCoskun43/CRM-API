"use stirct";

const { mongoose } = require("../configs/dbConnection");

// Review model için schema tanımı
const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product", // Ürün modeline referans
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Kullanıcı modeline referans
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // 1 ile 5 arasında bir değerlendirme
    },
    comment: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000, // Yorumun uzunluğu 1-1000 karakter arasında
    },
  },
  {
    timestamps: true, // otomatik olarak createdAt ve updatedAt alanlarını yönetir
    collection: "reviews",
  }
);

// Review modelini oluştur
const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
