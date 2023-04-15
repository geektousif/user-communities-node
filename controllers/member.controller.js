const asyncHandler = require("express-async-handler");
const Member = require("../models/member.model");

const addMember = asyncHandler(async (req, res) => {
  const { community, user, role } = req.validatedInput;

  //   TODO: member validatorr needed

  const member = await Member.create({ community, user, role });

  return res.json({
    status: true,
    content: {
      data: member,
    },
  });
});

const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await Member.findOne({ _id: id });
  if (!member) {
    return res.json({
      status: false,
      errors: [
        {
          message: "Member not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ],
    });
  }

  await Member.deleteOne({ _id: id });
  return res.status(200).json({
    status: true,
  });
});

module.exports = { addMember, deleteMember };
