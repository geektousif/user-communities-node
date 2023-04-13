const Validator = require("validatorjs");
const User = require("../models/user.model");

const loginValidator = async (req, res, next) => {
  try {
    const data = req.body;
    Validator.registerAsync(
      "user_exist",
      async function (email, attribute, req, passes) {
        const user = await User.findOne({ email: email });
        if (!user) {
          return passes(false, "User with this email doesn't exist");
        }
      }
    );
    const rules = {
      email: "required|user_exist",
      password: "required",
    };

    validatedInput = new Validator(data, rules);

    validatedInput.fails(async function () {
      const errors = validatedInput.errors.all();
      return res.status(400).json({ status: false, errors });
    });

    return next();
  } catch (error) {
    console.error(error);
  }
};

module.exports = loginValidator;
