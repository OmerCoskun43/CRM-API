"use strict";
const { mongoose } = require("../configs/dbConnection");

const EventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User modeline referans
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Customer modeline referans
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "events",
  }
);

// Model oluşturulması
const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
