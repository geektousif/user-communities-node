const Validator = require("validatorjs");
const Community = require("../models/community.model");
const slugify = require("slugify");

const creationValidator = async (req, res, next) => {
  try {
    const { name } = req.body;

    Validator.registerAsync(
      "slug_exist",
      async function (name, attribute, req, passes) {
        const community = await Community.findOne({
          slug: slugify(name, { lower: true }),
        });
        if (community) {
          return passes(false, "Slug with this community name already exist");
        }
      }
    );

    const rules = {
      name: "required|min:2|slug_exist",
    };

    const validation = new Validator({ name }, rules);

    validation.fails(async function () {
      const errors = validation.errors.all();
      return res.status(400).json({ status: false, errors }); // TODO error as said
    });

    return next();
  } catch (error) {
    console.error(error);
  }
};

module.exports = { creationValidator };
