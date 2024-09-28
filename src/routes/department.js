"use strict";

const router = require("express").Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
} = require("../controllers/department");

const {
  isAdmin,
  isSelfOrAdmin,
  isLeadOrAdmin,
} = require("../middlewares/permission");

router.route("/").get(list).post(isAdmin, create);
router
  .route("/:id")
  .get(isSelfOrAdmin, read)
  .put(isAdmin, update)
  .patch(isAdmin, update)
  .delete(isAdmin, _delete);

module.exports = router;
