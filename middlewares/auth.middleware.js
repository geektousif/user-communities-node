const asyncHandler = require("express-async-handler");
const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/index");
const User = require("../models/user.model");

exports.loggedInCheck = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("You need to sign in to proceed.");
  }

  try {
    const decodedPayload = JWT.verify(token, JWT_SECRET);
    req.user = await User.findById(
      decodedPayload._id,
      "_id name email created_at"
    );
    next();
  } catch (error) {
    res.status(401);
    throw new Error("You need to sign in to proceed.");
  }
});
