const { Snowflake } = require("@theinternetfolks/snowflake");
const mongoose = require("mongoose");
const slugify = require("slugify");
const crypto = require("crypto");

const communitySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      maxLength: 128,
      required: true,
    },
    slug: {
      type: String,
      maxLength: 255,
      unique: true,
    },
    owner: {
      type: String,
      ref: "User",
    },
  },
  { timestamps: true, _id: false }
);

communitySchema.pre("save", async function (next) {
  slugged = slugify(this.name, { lower: true });
  this.slug = `${slugged}-${crypto.randomBytes(8).toString("hex")}`;
});

module.exports = mongoose.model("Community", communitySchema);
