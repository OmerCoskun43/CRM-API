"use strict";

const { mongoose } = require("../configs/dbConnection");

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "departments",
  }
);
const Department = mongoose.model("Department", DepartmentSchema);
module.exports = Department;
