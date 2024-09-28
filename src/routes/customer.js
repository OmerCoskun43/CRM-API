"use strict";

const router = require("express").Router();
const {
  list,
  create,
  read,
  update,
  delete: _delete,
  listCustomerByDepartment,
} = require("../controllers/customer");
const {
  isSelfOrAdmin,
  isLeadOrAdmin,
  isAdmin,
} = require("../middlewares/permission");

// Müşteri listesi görüntüleme (Admin ve Lead için)
router.get("/", isAdmin, list);
router.get("/department/:id", isLeadOrAdmin, listCustomerByDepartment); // Sadece adminler tüm müşterileri görebilir
router.get("/:id", isSelfOrAdmin, read); // Kullanıcı kendisini veya adminleri okuyabilir

// Müşteri oluşturma (Admin ve Lead için)
router.post("/", isLeadOrAdmin, create); // Sadece leadler yeni müşteri oluşturabilir

// Müşteri güncelleme (Admin ve Lead için)
router.put("/:id", isSelfOrAdmin, update); // Kullanıcı kendisini veya adminleri güncelleyebilir
router.patch("/:id", isSelfOrAdmin, update); // Kullanıcı kendisini veya adminleri güncelleyebilir

// Müşteri silme (Admin ve Lead için)
router.delete("/:id", isAdmin, _delete); // Sadece adminler müşteri silebilir

module.exports = router;
