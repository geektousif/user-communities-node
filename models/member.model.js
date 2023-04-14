const { Snowflake } = require("@theinternetfolks/snowflake");
const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(),
    },
    community: {
      type: String,
      ref: "Community",
    },
    user: {
      type: String,
      ref: "User",
    },
    role: {
      type: String,
      ref: "Role",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
    _id: false,
  }
);

module.exports = mongoose.model("Community", communitySchema);
