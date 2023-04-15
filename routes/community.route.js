const express = require("express");
const router = express.Router();

const { loggedInCheck } = require("../middlewares/auth.middleware");
const {
  create,
  getAll,
  getAllMembers,
  myOwnedCommunity,
  myJoinedCommunity,
} = require("../controllers/community.controller");
const { creationValidator } = require("../validators/community.validator");

router.post("/", loggedInCheck, creationValidator, create);
router.get("/", getAll);
router.get("/:id/members", getAllMembers);
router.get("/me/owner", loggedInCheck, myOwnedCommunity);
router.get("/me/member", loggedInCheck, myJoinedCommunity);

module.exports = router;
