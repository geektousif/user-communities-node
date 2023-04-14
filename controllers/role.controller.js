const asyncHandler = require("express-async-handler");
const Validator = require("validatorjs");

const Role = require("../models/role.model");

const createRole = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    const validation = new Validator({ name }, { name: "required|min:2" });
    validation.fails(async function () {
      const errors = validation.errors.all();
      return res.status(400).json({ status: false, errors }); // TODO error as said
    });

    const role = await Role.create({ name });

    return res.json({
      status: true,
      content: {
        data: {
          id: role._id,
          name: role.name,
          created_at: role.createdAt,
          updated_at: role.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

// TODO get all role

module.exports = { createRole };
