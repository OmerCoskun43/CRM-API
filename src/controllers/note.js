"use strict";

const Note = require("../models/note");
const User = require("../models/user");
const Customer = require("../models/customer");
const { mongoose } = require("../configs/dbConnection");

module.exports = {
  list: async (req, res) => {
    const notes = await res.getModelList(Note);

    res.status(200).send({
      error: false,
      message: "List of notes",
      details: await res.getModelListDetails(Note),
      data: notes,
    });
  },

  create: async (req, res, next) => {
    const { userId, customerId, content } = req.body;

    if (!userId || !customerId || !content) {
      res.errorStatusCode = 400;
      return next(
        new Error(
          "Please fill in all required fields: userId, customerId, and content"
        )
      );
    }

    const user = await User.findById(userId);
    const customer = await Customer.findById(customerId);
    if (!user || !customer) {
      res.errorStatusCode = 404;
      return next(new Error("User or Customer not found"));
    }

    const newNote = await Note.create(req.body);

    res.status(201).send({
      error: false,
      message: "Note created successfully",
      data: newNote,
    });
  },

  read: async (req, res, next) => {
    const noteId = req.params.id;

    // ID kontrolü
    if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Note id"));
    }

    const note = await Note.findById(noteId);

    if (!note) {
      res.errorStatusCode = 404;
      return next(new Error("Note not found"));
    }

    res.status(200).send({
      error: false,
      message: "Note listed successfully",
      data: note,
    });
  },

  update: async (req, res, next) => {
    const noteId = req.params.id;

    // ID kontrolü
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return handleErrorResponse(
        res,
        next,
        400,
        "Please provide a valid Note id"
      );
    }

    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNote) {
      res.errorStatusCode = 404;
      return next(new Error("Note not updated"));
    }

    res.status(200).send({
      error: false,
      message: "Note updated successfully",
      data: updatedNote,
    });
  },

  delete: async (req, res, next) => {
    const noteId = req.params.id;

    // ID kontrolü
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return handleErrorResponse(
        res,
        next,
        400,
        "Please provide a valid Note id"
      );
    }

    // Note'u sil
    const deleteResult = await Note.findByIdAndDelete(noteId);

    if (!deleteResult) {
      res.errorStatusCode = 404;
      return next(new Error("Note not deleted"));
    }

    res.status(200).send({
      error: false,
      message: "Note deleted successfully",
      data: deleteResult,
    });
  },
};
