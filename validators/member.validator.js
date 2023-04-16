const Validator = require("validatorjs");
const User = require("../models/user.model");
const Member = require("../models/member.model");
const Community = require("../models/community.model");
const Role = require("../models/role.model");
const asyncHandler = require("express-async-handler");
const { validationErrors } = require("../utils/errorResponse");

const addMemberValidator = asyncHandler(async (req, res, next) => {
  try {
    const { community, role, user } = req.body;

    Validator.registerAsync(
      "community_exist",
      async function (community, attribute, req, passes) {
        try {
          const comm = await Community.findOne({ community });
          if (comm) {
            passes(false, "Community not found.");
          } else {
            passes();
          }
        } catch (error) {
          passes(false, error.message);
        }
      }
    );
    Validator.registerAsync(
      "role_exist",
      async function (role, attribute, req, passes) {
        try {
          const rol = await Role.findOne({ role });
          if (rol) {
            passes(false, "Role not found.");
          } else {
            passes();
          }
        } catch (error) {
          passes(false, error.message);
        }
      }
    );
    Validator.registerAsync(
      "user_exist",
      async function (user, attribute, req, passes) {
        try {
          const usr = await User.findOne({ user });
          if (usr) {
            passes(false, "Role not found.");
          } else {
            passes();
          }
        } catch (error) {
          passes(false, error.message);
        }
      }
    );

    const rules = {
      community: "required|community_exist",
      role: "required|role_exist",
      user: "required|user_exist",
    };

    const validation = new Validator({ community, user, role }, rules);

    validation.fails(async function () {
      try {
        const errors = validation.errors.all();
        return validationErrors(res, errors, "RESOURCE_NOT_FOUND", 400, false);
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ status: false, errors: { server: "Internal server error" } });
      }
    });
    validation.passes(() => {
      req.validatedInput = { community, user, role };
      next();
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ status: false, errors: { email: error.message } });
  }
});

module.exports = { addMemberValidator };
