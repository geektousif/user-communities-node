const express = require("express");
const router = express.Router();

const { loggedInCheck } = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/admin.middleware");
const { addMember } = require("../controllers/member.controller");

router.post("/", loggedInCheck, isAdmin, addMember);

module.exports = router;
