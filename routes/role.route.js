const express = require("express");
const router = express.Router();

const { loggedInCheck } = require("../middlewares/auth.middleware");
const { createRole, getAllRoles } = require("../controllers/role.controller");

router.post("/", loggedInCheck, createRole);
router.get("/", getAllRoles);

module.exports = router;
