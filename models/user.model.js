const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const { JWT_EXPIRY, JWT_SECRET } = require("../config/index");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(),
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
      select: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
    _id: false,
    autoIndex: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods = {
  matchPassword: async function (passwordInput) {
    return await bcrypt.compare(passwordInput, this.password);
  },

  generateJWT: function () {
    return JWT.sign({ _id: this._id, email: this.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
  },
};

module.exports = mongoose.model("User", userSchema);
