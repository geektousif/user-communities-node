const Validator = require("validatorjs");
const User = require("../models/user.model");

const signUpValidator = async (req, res, next) => {
  try {
    const data = req.body;

    Validator.registerAsync(
      "email_exist",
      async function (email, attribute, req, passes) {
        const user = await User.findOne({ email: email });
        if (user) {
          return passes(false, "Email already exists");
        }
      }
    );

    const rules = {
      name: "required|string|min:2|max:64",
      email: "required|email|max:128|email_exist",
      password: [
        "required",
        "regex:/^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/",
      ],
      confirmPassword: "required|same:password",
    };

    validatedUser = new Validator(data, rules, {
      "regex.password":
        "Your password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    });

    // validatedUser.checkAsync((ok) => {
    //   if (!ok) {
    //     const errors = validatedUser.errors.all();
    //     res.status(400).json({ status: false, errors });
    //   }
    //   // Validation passed, continue processing the request
    //   next();
    // });

    validatedUser.fails(async function () {
      const errors = validatedUser.errors.all();
      return res.status(400).json({ status: false, errors });
    });

    return next();
  } catch (error) {
    console.error(error);
  }
};

module.exports = signUpValidator;
