const mongoose = require("mongoose");
import { Snowflake } from "@theinternetfolks/snowflake";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      primaryKey: true,
      default: () => Snowflake.generate(),
      index: true,
      unique: true,
    },
    name: {
      type: String,
      maxLength: 64,
      required: true,
    },
    email: {
      type: String,
      maxLength: 128,
      unique: true,
    },
    password: {
      type: String,
      maxLength: 64,
    },
  },
  {
    timestamps: true,
    id: false,
  }
);

module.exports = mongoose.Model("User", userSchema);
