"use strict";

const router = require("express").Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
} = require("../controllers/product");
const { isLeadOrAdmin } = require("../middlewares/permission");

// Ürün listesini görüntüleme (Admin ve Lead için)
router.get("/", isLeadOrAdmin, list);

// Yeni ürün oluşturma (Admin ve Lead için)
router.post("/", isLeadOrAdmin, create);

// Belirli bir ürünü görüntüleme, güncelleme ve silme (Admin ve Lead için)
router
  .route("/:id")
  .get(isLeadOrAdmin, read) // Admin ve Lead ürünü okuyabilir
  .put(isLeadOrAdmin, update) // Admin ve Lead ürünü güncelleyebilir
  .patch(isLeadOrAdmin, update) // Admin ve Lead ürünü güncelleyebilir
  .delete(isLeadOrAdmin, _delete); // Sadece Admin ürünü silebilir

module.exports = router;
