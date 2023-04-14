const express = require("express");
const router = express.Router();

const {
  signUpValidator,
  signInValidator,
} = require("../validators/auth.validator");
const { loggedInCheck } = require("../middlewares/auth.middleware");
const {
  signUp,
  signIn,
  getMe,
  logout,
} = require("../controllers/user.controller");

router.post("/signup", signUpValidator, signUp);
router.post("/signin", signInValidator, signIn);
router.get("/me", loggedInCheck, getMe);
router.get("/logout", loggedInCheck, logout);

module.exports = router;
