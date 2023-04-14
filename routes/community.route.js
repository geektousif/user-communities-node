const express = require("express");
const router = express.Router();

const { loggedInCheck } = require("../middlewares/auth.middleware");
const { create, getAll } = require("../controllers/community.controller");
const { creationValidator } = require("../validators/community.validator");

router.post("/", loggedInCheck, creationValidator, create);
router.get("/", getAll);

module.exports = router;
