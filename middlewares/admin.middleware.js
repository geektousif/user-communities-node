const asyncHandler = require("express-async-handler");
const Member = require("../models/member.model");
const Role = require("../models/role.model");

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { _id: adminRoleId } = await Role.findOne({
      name: "Community Admin",
    });

    const { community } = req.body;
    const currentUser = req.user;
    const communityAdmin = await Member.findOne({
      community,
      user: currentUser._id,
      role: adminRoleId,
    });
    console.log(communityAdmin);
    if (!communityAdmin) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });
    }

    return next();
  } catch (error) {
    throw new Error("NOT_ALLOWED_ACCESS");
    // TODO error message
  }
});

module.exports = isAdmin;
