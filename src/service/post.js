const httpStatus = require("http-status");
const { PostModel, UserModel } = require("../models");
const ApiError = require("../utils/ApiError");

const create = async (body, userId) => {
  const doc = await PostModel.create({ ...body });
  doc.userId = userId;
  await doc.save();

  
  return {
    success: true,
    response: doc,
  };
};

const getSingle = async (_id) => {
  const doc = await PostModel.findOne({ _id })
    .populate("userId")
    .populate("likes");
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, " Resource not found");
  }
  return doc;
};

const get = async (userId, page, pageSize) => {
  const user = await UserModel.findById(userId);
  const followers = [userId, ...user.followers];
  console.log("followers: ", followers);

  const skip = (page - 1) * pageSize;

  const posts = await PostModel.find({ userId: { $in: followers } })
    .populate("userId")
    .populate("likes")
    .skip(skip)
    .limit(pageSize);

  return {
    Response: posts,
  };
};

const updateOne = async (_id, body) => {
  const doc = await getSingle(_id);
  await Object.assign(doc, body);
  await doc.save();
  return { Success: true, Response: doc };
};

const deleteSingle = async (_id) => {
  const doc = await getSingle(_id);
  await doc.remove();
  return {
    Success: true,
  };
};

const userExistinLikes = async (postId, userId) => {
  await getSingle(postId);
  const existingPost = await PostModel.findOne({
    _id: postId,
    likes: { $elemMatch: { $eq: userId } },
  });
  console.log("existingPOst: ", existingPost);
  return existingPost;
};

const likeAPost = async (postId, userId) => {
  let doc = await userExistinLikes(postId, userId);
  if (doc) {
    throw new ApiError(httpStatus.CONFLICT, "Post alreay liked by this user");
  }
  doc = await PostModel.updateOne(
    { _id: postId },
    { $push: { likes: userId } }
  );
  if (doc.nModified === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not Updated.");
  }
  return { Success: true, message: "Post is liked" };
};

const removeLike = async (postId, userId) => {
  console.log("///****---------", userId, postId);
  await getSingle(postId);
  const result = await PostModel.updateOne(
    { _id: postId },
    { $pull: { likes: userId } }
  );
  console.log("Result: ", result);
  if (result.nModified === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Post is not liked by the specified user."
    );
  }
  return { succeess: true, Response: result };
};

const countLike = async (postId) => {
  const post = await getSingle(postId);
  const totalLikes = await PostModel.aggregate([
    { $match: { _id: post._id } },
    { $project: { count: { $size: "$likes" } } },
  ]);
  console.log("Total LIkes: ", totalLikes);
  return { Likes: totalLikes[0].count };
};

module.exports = {
  create,
  getSingle,
  get,
  deleteSingle,
  likeAPost,
  removeLike,
  updateOne,
  countLike,
};
