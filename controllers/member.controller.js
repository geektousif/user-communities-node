const asyncHandler = require("express-async-handler");
const Member = require("../models/member.model");

const addMember = asyncHandler(async (req, res) => {
  const { community, user, role } = req.body;

  //   TODO: member validatorr needed

  const member = await Member.create({ community, user, role });

  return res.json({
    status: true,
    content: {
      data: member,
    },
  });
});

module.exports = { addMember };
