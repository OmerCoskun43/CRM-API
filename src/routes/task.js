"use strict";

const router = require("express").Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
  customerTasks,
  userTasks,
} = require("../controllers/task");
const { isLeadOrAdmin } = require("../middlewares/permission");

// Tüm görevleri listeleme (Admin ve Lead için)
router.get("/", isLeadOrAdmin, list);

// Yeni görev oluşturma (Admin ve Lead için)
router.post("/", isLeadOrAdmin, create);

// Kullanıcıya özel görevleri listeleme (Her kullanıcı kendi görevlerini görebilir)
router.get("/userTasks/:userId", userTasks);

// Müşteriye özel görevleri listeleme (Admin ve Lead için)
router.get("/customerTasks/:customerId", isLeadOrAdmin, customerTasks);

// Belirli bir görevin detaylarını görüntüleme, güncelleme ve silme (Admin ve Lead için)
router
  .route("/:id")
  .get(isLeadOrAdmin, read) // Admin ve Lead görev detaylarını görebilir
  .put(isLeadOrAdmin, update) // Admin ve Lead görev güncelleyebilir
  .patch(isLeadOrAdmin, update) // Admin ve Lead görev güncelleyebilir
  .delete(isLeadOrAdmin, _delete); // Sadece Admin görevleri silebilir

module.exports = router;
