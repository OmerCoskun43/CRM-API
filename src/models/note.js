"use strict";
const { mongoose } = require("../configs/dbConnection");

// Note Schema
const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Kullanıcı modeli ile ilişkilendirme
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Müşteri modeli ile ilişkilendirme
      required: true,
    },
    content: {
      type: String,
      required: true, // Not içeriğinin zorunlu olduğunu belirtir
    },
  },
  {
    timestamps: true,
    collection: "notes",
  }
);

// Note Model
const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
