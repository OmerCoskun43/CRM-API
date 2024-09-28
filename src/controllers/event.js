"use strict";

const Event = require("../models/event");
const User = require("../models/user");
const Customer = require("../models/customer");
const { mongoose } = require("../configs/dbConnection");

module.exports = {
  list: async (req, res) => {
    const events = await res.getModelList(Event, {}, [
      { path: "userId", select: "name email isAdmin isLead" },
      { path: "customerId", select: "name email" },
    ]);
    res.status(200).send({
      error: false,
      message: "List of events",
      details: await res.getModelListDetails(Event),
      data: events,
    });
  },

  create: async (req, res, next) => {
    const { userId, customerId, eventType, eventDate, details } = req.body;
    if (!userId || !customerId || !eventType || !eventDate || !details) {
      res.errorStatusCode = 400;
      return next(
        new Error(
          "Please fill userId, customerId, eventType, eventDate and details"
        )
      );
    }

    const user = await User.findById(userId);
    const customer = await Customer.findById(customerId);
    if (!user || !customer) {
      res.errorStatusCode = 404;
      return next(new Error("User or Customer not found"));
    }

    const newEvent = await Event.create(req.body);
    res.status(201).send({
      error: false,
      message: "Event created successfully",
      data: newEvent,
    });
  },

  read: async (req, res, next) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Event id"));
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      res.errorStatusCode = 404;
      return next(new Error("Event not found"));
    }

    res.status(200).send({
      error: false,
      message: "Event found",
      data: event,
    });
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Event id"));
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      res.errorStatusCode = 404;
      return next(new Error("Event not updated or not found"));
    }

    res.status(200).send({
      error: false,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Event id"));
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      res.errorStatusCode = 404;
      return next(new Error("Event not found or already deleted"));
    }

    res.status(200).send({
      error: false,
      message: "Event deleted successfully",
      data: deletedEvent,
    });
  },

  customerEvents: async (req, res, next) => {
    const { customerId } = req.params;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid Customer id"));
    }

    const events = await res.getModelList(
      Event,
      {
        customerId,
      },
      [
        { path: "userId", select: "name email isAdmin isLead" },
        { path: "customerId", select: "name email" },
      ]
    );

    if (!events.length) {
      res.errorStatusCode = 404;
      return next(new Error("No events found for this customer"));
    }

    // Olayları döndür
    res.status(200).send({
      error: false,
      message: "Events retrieved successfully",
      details: await res.getModelListDetails(Event, { customerId }),
      data: events,
    });
  },
  userEvents: async (req, res, next) => {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.errorStatusCode = 400;
      return next(new Error("Please provide a valid User id"));
    }

    const events = await res.getModelList(
      Event,
      {
        userId,
      },
      [
        { path: "userId", select: "name email isAdmin isLead" },
        { path: "customerId", select: "name email" },
      ]
    );

    if (!events.length) {
      res.errorStatusCode = 404;
      return next(new Error("No events found for this user"));
    }

    res.status(200).send({
      error: false,
      message: "Events retrieved successfully",
      details: await res.getModelListDetails(Event, { userId }),
      data: events,
    });
  },
};
