const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user.model");

exports.registerUser = expressAsyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });
  } catch (error) {}
});
