const express = require("express");
const router = express.Router();

const signUpValidator = require("../validators/signUpValidator");
const signInValidator = require("../validators/signInValidator");
const authMiddleware = require("../middlewares/auth.middleware");
const { signUp, signIn, getMe } = require("../controllers/user.controller");

router.post("/signup", signUpValidator, signUp);
router.post("/signin", signInValidator, signIn);
router.get("/me", authMiddleware, getMe);

module.exports = router;
