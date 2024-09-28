"use strict";

const router = require("express").Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
  totalProfit,
  totalProfitByCategory,
} = require("../controllers/sale");
const { isLeadOrAdmin } = require("../middlewares/permission");

// Satış listesini görüntüleme (Admin ve Lead için)
router.get("/", isLeadOrAdmin, list);

// Yeni satış oluşturma (Admin ve Lead için)
router.post("/", isLeadOrAdmin, create);

// Toplam kar hesaplama (Admin ve Lead için)
router.get("/totalProfit", isLeadOrAdmin, totalProfit);

// Kategoriye göre toplam kar (Admin ve Lead için)
router.get("/totalProfit/:id", isLeadOrAdmin, totalProfitByCategory);

// Belirli bir satışın detaylarını görüntüleme, güncelleme ve silme (Admin ve Lead için)
router
  .route("/:id")
  .get(isLeadOrAdmin, read) // Admin ve Lead satış bilgilerini okuyabilir
  .put(isLeadOrAdmin, update) // Admin ve Lead satış bilgilerini güncelleyebilir
  .patch(isLeadOrAdmin, update) // Admin ve Lead satış bilgilerini güncelleyebilir
  .delete(isLeadOrAdmin, _delete); // Sadece Admin satışları silebilir

module.exports = router;
