"use strict";

const router = require("express").Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
  productReviews,
  userReviews,
} = require("../controllers/review");

// Tüm incelemeleri listele ve yeni inceleme oluştur
router.route("/").get(list).post(create);

// Kullanıcıya ait incelemeleri listele
router.route("/userReviews/:userId").get(userReviews);

// Ürün için incelemeleri listele
router.route("/productReviews/:productId").get(productReviews);

// Belirli bir incelemeyi okuma, güncelleme ve silme
router.route("/:id").get(read).patch(update).put(update).delete(_delete);

module.exports = router;
