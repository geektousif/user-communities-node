const asyncHandler = require("express-async-handler");
const Community = require("../models/community.model");
const Member = require("../models/member.model");
const Role = require("../models/role.model");
const { model } = require("mongoose");

const create = asyncHandler(async (req, res) => {
  try {
    const name = req.validatedName;
    const user = req.user;
    const community = await Community.create({ name, owner: user._id });

    // TODO They should also be added with the role Community Admin
    const { _id: adminRoleId } = await Role.findOne({
      name: "Community Admin",
    });

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
    return res.status(500).send("Something went wrong");
  }
});

const getAll = asyncHandler(async (req, res) => {
  const total = await Community.countDocuments();
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;
  const pages = Math.ceil(total / perPage);

  const communities = await Community.find({}, { __v: 0 })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .populate("owner", "_id name", "User");

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

const getAllMembers = asyncHandler(async (req, res) => {
  const { id: communityId } = req.params;

  const total = await Member.find({ community: communityId }).countDocuments();
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;
  const pages = Math.ceil(total / perPage);

  const members = await Member.find({ community: communityId }, { __v: 0 })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .populate("user", "_id name", "User")
    .populate("role", "_id name", "Role");

  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: total,
        pages: pages,
        page: page,
      },
      data: members,
    },
  });
});

const myOwnedCommunity = asyncHandler(async (req, res) => {
  const me = req.user;

  const total = await Community.find({ owner: me._id }).countDocuments();
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;
  const pages = Math.ceil(total / perPage);

  const communities = await Community.find({ owner: me._id })
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

const myJoinedCommunity = asyncHandler(async (req, res) => {
  const me = req.user;

  const myMembershipCommunities = await Member.find({ user: me._id }).select(
    "community"
  );
  const communityIDArray = myMembershipCommunities.map((obj) => obj.community);

  const total = communityIDArray.length;
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;
  const pages = Math.ceil(total / perPage);

  const communities = await Community.find({ _id: { $in: communityIDArray } })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .populate("owner", "_id name", "User")
    .select("-__v");

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

module.exports = {
  create,
  getAll,
  getAllMembers,
  myOwnedCommunity,
  myJoinedCommunity,
};
