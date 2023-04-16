const asyncHandler = require("express-async-handler");
const Member = require("../models/member.model");

const addMember = asyncHandler(async (req, res) => {
  const { community, user, role } = req.validatedInput;

  try {
    const membership = await Member.findOne({
      $and: [{ community: community }, { user: user }],
    });
    console.log(membership);
    if (membership) {
      return res.json({
        status: false,
        errors: [
          {
            message: "User is already added in the community.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }
  } catch (error) {
    console.error(error);
  }

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
