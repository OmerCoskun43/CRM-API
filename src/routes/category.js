"use strict";

const router = require("express").Router();
const {
  list,
  create,
  read,
  update,
  delete: _delete,
} = require("../controllers/category");
const { isAdmin } = require("../middlewares/permission");

// Sadece admin kontrolü gerekli olan route'lar

router.post("/", isAdmin, create);
router.route("/").get(list); // Tüm kullanıcılar kategori listesini görebilir
router
  .route("/:id")
  .get(read) // Kategori detayını tüm kullanıcılar görebilir
  .put(isAdmin, update) // Sadece admin güncelleyebilir
  .patch(isAdmin, update) // Sadece admin güncelleyebilir
  .delete(isAdmin, _delete); // Sadece admin silebilir

module.exports = router;
