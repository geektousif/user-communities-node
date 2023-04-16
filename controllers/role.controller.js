const asyncHandler = require("express-async-handler");
const Validator = require("validatorjs");
const { validationErrors } = require("../utils/errorResponse");
const Role = require("../models/role.model");

const createRole = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    const validation = new Validator({ name }, { name: "required|min:2" });
    validation.fails(async function () {
      const errors = validation.errors.all();
      return validationErrors(res, errors, "INVALID_INPUT", 400, false);
    });

    validation.passes(async function () {
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

const getAllRoles = asyncHandler(async (req, res) => {
  const total = await Role.countDocuments();
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;
  const pages = Math.ceil(total / perPage);

  const roles = await Role.find({}, { __v: 0 })
    .skip(perPage * page - perPage)
    .limit(perPage);

  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: total,
        pages: pages,
        page: page,
      },
      data: roles,
    },
  });
});

module.exports = { createRole, getAllRoles };
