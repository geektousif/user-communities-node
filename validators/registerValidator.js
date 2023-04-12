const Validator = require("validatorjs");
const User = require("../models/user.model");

const registerValidator = async (req, res, next) => {
  try {
    const data = req.body;

    Validator.registerAsync(
      "email_exist",
      function (email, attribute, req, passes) {
        User.findOne({ email: email }, function (error, user) {
          if (error) {
            throw new Error(error);
            return passes(false, "Some Error Occurred");
          }
          if (user) {
            return passes(false, "Email already exists");
          }
        });
      }
    );

    const rules = {
      name: "string|max:64",
      email: "required|email|max:128|email_exist",
      password: [
        "required|string|max:128",
        "regex:/^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/",
      ],
      confirmPassword: "required|same:password",
    };

    validatedUser = new Validator(data, rules);

    validatedUser.checkAsync((ok) => {
      if (!ok) {
        const errors = validatedUser.errors.all();
        return res.status(422).json({ errors });
      }
      // Validation passed, continue processing the request
      next();
    });

    if (validatedUser.fails()) {
      const errors = validatedUser.errors.all();
      return res.status(422).json({ errors });
    }

    return next();
  } catch (error) {
    throw new Error(error);
  }
};
