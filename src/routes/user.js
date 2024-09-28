"use strict";

const router = require("express").Router();

const {
  list,
  create,
  read,
  update,
  delete: _delete,
  listUserByDepartment,
} = require("../controllers/user");

const upload = require("../middlewares/upload");

const {
  isAdmin,
  isSelfOrAdmin,
  isLeadOrAdmin,
} = require("../middlewares/permission");

router.get("/department/:id", isLeadOrAdmin, listUserByDepartment);
router.route("/").get(isAdmin, list).post(upload.single("profilePic"), create);

router
  .route("/:id")
  .all(isSelfOrAdmin)
  .get(read)
  .put(upload.single("profilePic"), update)
  .patch(upload.single("profilePic"), update)
  .delete(_delete);

module.exports = router;
