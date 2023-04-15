const express = require("express");
const router = express.Router();

const { loggedInCheck } = require("../middlewares/auth.middleware");
const {
  canAddMember,
  canDeleteMember,
} = require("../middlewares/member_auth.middleware");
const { addMember, deleteMember } = require("../controllers/member.controller");
const { addMemberValidator } = require("../validators/member.validator");

router.post("/", loggedInCheck, canAddMember, addMemberValidator, addMember);
router.delete("/:id", loggedInCheck, canDeleteMember, deleteMember);

module.exports = router;
