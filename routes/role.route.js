const express = require("express");
const router = express.Router();

const { loggedInCheck } = require("../middlewares/auth.middleware");
const { createRole } = require("../controllers/role.controller");

router.post("/", loggedInCheck, createRole);

module.exports = router;
