const asyncHandler = require("express-async-handler");
const Community = require("../models/community.model");
const Member = require("../models/member.model");
const Role = require("../models/role.model");

const create = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.user;
    const community = await Community.create({ name, owner: user._id });

    // TODO They should also be added with the role Community Admin
    const adminRoleId = await Role.findOne({ name: "Community Admin" })._id;
    await Member.create({
      community: community._id,
      user: community.owner,
      role: adminRoleId,
    });

    return res.json({
      status: true,
      content: {
        data: {
          id: community._id,
          name: community.name,
          slug: community.slug,
          owner: community.owner,
          created_at: community.createdAt,
          updated_at: community.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

const getAll = asyncHandler(async (req, res) => {
  const total = await Community.countDocuments();
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;
  const pages = Math.ceil(total / perPage);

  const communities = await Community.find()
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
      data: communities,
    },
  });
});

module.exports = { create, getAll };
