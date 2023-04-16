const Validator = require("validatorjs");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Community = require("../models/community.model");
const { validationErrors } = require("../utils/errorResponse");

const creationValidator = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;

    Validator.registerAsync(
      "slug_exist",
      async function (name, attribute, req, passes) {
        try {
          const community = await Community.findOne({
            slug: slugify(name, { lower: true }),
          });
          if (community) {
            return passes(false, "Slug with this community name already exist");
          } else {
            passes();
          }
        } catch (error) {
          passes(false, error.message);
        }
      }
    );

    const rules = {
      name: "required|min:2|slug_exist",
    };

    const validation = new Validator({ name }, rules);

    validation.fails(async function () {
      try {
        const errors = validation.errors.all();
        return validationErrors(res, errors, "INVALID_INPUT", 400, false);
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ status: false, errors: { server: "Internal server error" } });
      }
    });

    validation.passes(() => {
      req.validatedName = name;
      next();
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = { creationValidator };
