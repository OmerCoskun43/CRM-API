"use strict ";

const sendMail = require("../helpers/sendMail");
const User = require("../models/user");
const Department = require("../models/department");
const { mongoose } = require("../configs/dbConnection");
const jwt = require("jsonwebtoken");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(User, {}, "departmentId");

    res.status(200).send({
      error: false,
      message: "List of users",
      details: await res.getModelListDetails(User),
      data,
    });
  },

  create: async (req, res, next) => {
    const { name, email, password, departmentId } = req.body;

    if (!name || !email || !password || !departmentId) {
      res.errorStatusCode = 400;
      return next(
        new Error("Please fill name, email, departmentId and password")
      );
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Department id"));
    }
    const department = await Department.findById(departmentId);

    if (!department) {
      res.errorStatusCode = 404;
      return next(new Error("Department not found"));
    }

    const user = await User.create({
      ...req.body,
      isAdmin: false,
      isLead: false,
      isLoggedIn: true,
      profilePic: req.file && `/uploads/${req.file.filename}`,
    });

    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    sendMail({
      to: email,
      subject: "Hesap oluşturuldu",
      html: `<h1>${formattedName} teşekkür ederiz. Hesap oluşturuldu.</h1>`,
    });

    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isLead: user.isLead,
        isActive: user.isActive,
        departmentId: user.departmentId,
        profilePic: user.profilePic,
      },
      process.env.ACCESS_KEY,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.REFRESH_KEY,
      { expiresIn: "3d" }
    );

    res.status(200).send({
      error: false,
      message: "Register  successfully",
      refreshToken,
      accessToken,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isLead: user.isLead,
        isActive: user.isActive,
        departmentId: user.departmentId,
        profilePic: user.profilePic,
      },
    });
  },

  read: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide user id"));
    }

    const user = await User.findOne({ _id: req.params.id }).populate(
      "departmentId"
    );

    if (!user) {
      res.errorStatusCode = 404;
      return next(new Error("User not found"));
    }

    res.status(200).send({
      error: false,
      message: "User listed successfully",
      data: user,
    });
  },

  update: async (req, res) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide user id"));
    }

    const userOld = await User.findOne({ _id: req.params.id });

    const updateData = {
      ...req.body,
      isAdmin: userOld.isAdmin || false,
      isLead: false,
    };

    // Eğer dosya yüklendiyse profilePic'i ekle
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      {
        new: true, // Güncellenmiş kullanıcıyı döndür
        runValidators: true, // Validatorları çalıştır
      }
    ).populate("departmentId");

    if (!user) {
      res.errorStatusCode = 404;
      return next(new Error("User not found or not updated"));
    }

    // İsim formatlama
    const formattedName = user.name[0].toUpperCase() + user.name.slice(1);

    sendMail({
      to: user.email,
      subject: "Hesap bilgileri güncellendi",
      html: `<h1>${formattedName} teşekkür ederiz. Hesap bilgileri güncellendi.</h1>`,
    });

    res.status(200).send({
      error: false,
      message: "User updated successfully",
      data: user,
    });
  },

  delete: async (req, res, next) => {
    const userId = req.params.id;

    // ID kontrolü
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid User id"));
    }

    // Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      res.errorStatusCode = 404;
      return next(new Error("User not found"));
    }

    // Kullanıcıyı sil
    const deleteResult = await User.deleteOne({ _id: userId });

    if (!deleteResult.deletedCount) {
      res.errorStatusCode = 404;
      return next(new Error("User not deleted"));
    }

    res.status(200).send({
      error: false,
      message: "User deleted successfully",
    });
  },

  listUserByDepartment: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Department id"));
    }
    const users = await User.find({ departmentId: req.params.id });
    res.status(200).send({
      error: false,
      message: "List of users",
      data: users,
    });
  },
};
