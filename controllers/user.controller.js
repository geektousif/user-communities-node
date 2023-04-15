const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");

const signUp = asyncHandler(async (req, res) => {
  try {
    // FIXME user create even after showing error
    const { name, email, password } = req.validatedData;

    const user = await User.create({ name, email, password });
    user.password = undefined;

    const token = user.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: token,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

const signIn = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.validatedInput;

    const user = await User.findOne({ email }).select("+password");

    const passwordMatched = user.matchPassword(password);

    if (passwordMatched) {
      const token = user.generateJWT();
      user.password = undefined;
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      return res.status(200).json({
        status: true,
        content: {
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
          meta: {
            access_token: token,
          },
        },
      });
    }
    return res.status(400).json({
      status: false,
      errors: [
        {
          message: "The credentials you provided are invalid.",
          code: "INVALID_CREDENTIALS",
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

// TODO make error response generic

const getMe = asyncHandler(async function (req, res) {
  const user = req.user;
  return res.json({
    status: true,
    content: {
      data: user,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: true,
    message: "Logged Out",
  });
});

module.exports = { signUp, signIn, getMe, logout };
