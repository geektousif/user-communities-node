const { Snowflake } = require("@theinternetfolks/snowflake");
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      maxLength: 64,
      required: true,
      unique: true,
    },
    // TODO scope
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.model("Role", roleSchema);
