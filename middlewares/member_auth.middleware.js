const asyncHandler = require("express-async-handler");
const Member = require("../models/member.model");
const Role = require("../models/role.model");

const canAddMember = asyncHandler(async (req, res, next) => {
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
    } else {
      return next();
    }
  } catch (error) {
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
});

const canDeleteMember = asyncHandler(async (req, res, next) => {
  try {
    const { _id: adminRoleId } = await Role.findOne({
      name: "Community Admin",
    });
    const { _id: moderatorRoleId } = await Role.findOne({
      name: "Community Moderator",
    });

    const currentUser = req.user;
    const authorized = await Member.findOne({
      user: currentUser._id,
      $or: [{ role: adminRoleId }, { role: moderatorRoleId }],
    });

    if (!authorized) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });
    } else {
      return next();
    }
  } catch (error) {
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
});

module.exports = { canAddMember, canDeleteMember };
