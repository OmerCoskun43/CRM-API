"use strict";

const router = require("express").Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
  customerEvents,
  userEvents,
} = require("../controllers/event");
const { isLeadOrAdmin, isSelfOrAdmin } = require("../middlewares/permission");

// Tüm etkinlikleri listeleme (Admin ve Lead için)
router.get("/", isLeadOrAdmin, list);

// Yeni etkinlik oluşturma (Sadece Admin için)
router.post("/", isLeadOrAdmin, create);

// Kullanıcı etkinliklerini görüntüleme (Kullanıcı sadece kendine ait etkinlikleri görebilir)
router.get("/userEvents/:userId", isSelfOrAdmin, userEvents);

// Müşteri etkinliklerini görüntüleme (Admin ve Lead için)
router.get("/customerEvents/:customerId", isLeadOrAdmin, customerEvents);

// Belirli bir etkinliği görüntüleme, güncelleme ve silme (Sadece Admin ve Lead için)
router
  .route("/:id")
  .get(isLeadOrAdmin, read) // Admin ve Lead etkinliği okuyabilir
  .patch(isLeadOrAdmin, update) // Admin ve Lead etkinliği güncelleyebilir
  .put(isLeadOrAdmin, update) // Admin ve Lead etkinliği güncelleyebilir
  .delete(isLeadOrAdmin, _delete); // Sadece Admin etkinliği silebilir

module.exports = router;
