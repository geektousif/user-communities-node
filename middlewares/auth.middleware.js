const asyncHandler = require("express-async-handler");
const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/index");
const User = require("../models/user.model");

const loggedInCheck = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: false,
      errors: [
        {
          message: "You need to sign in to proceed.",
          code: "NOT_SIGNEDIN",
        },
      ],
    });
  }

  try {
    const decodedPayload = JWT.verify(token, JWT_SECRET);
    req.user = await User.findById(
      decodedPayload._id,
      "_id name email created_at"
    );
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      errors: [
        {
          message: "You need to sign in to proceed.",
          code: "NOT_SIGNEDIN",
        },
      ],
    });
  }
});

module.exports = { loggedInCheck };
