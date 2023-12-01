const httpStatus = require("http-status");
const { CommentModel } = require("../models");
const ApiError = require("../utils/ApiError");

const create = async (body, userId) => {
  console.log("service body: *-*-*-*-*-*--*-*", userId);
  const doc = await CommentModel.create({ ...body });
  doc.userId = userId;
  await doc.save();

  return {
    success: true,
  };
};

const getSingle = async (_id) => {
  const doc = await CommentModel.findOne({ _id });
  console.log("doc;--------", doc);
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Resource not found.");
  }
  return doc;
};

const updateOne = async (commentId, body) => {
  const doc = await getSingle(commentId);
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

const userExistinLikes = async (commentId, userId) => {
  console.log("---*-*- ", commentId);
  await getSingle(commentId);
  const existingPost = await CommentModel.findOne({
    _id: commentId,
    likes: { $elemMatch: { $eq: userId } },
  });
  console.log("existingPOst: ", existingPost);
  return existingPost;
};

const likeAComment = async (commentId, userId) => {
  let doc = await userExistinLikes(commentId, userId);
  if (doc) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Comment already liked by this user"
    );
  }
  doc = await CommentModel.updateOne(
    { _id: commentId },
    { $push: { likes: userId } }
  );
  if (doc.nModified === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not Updated.");
  }
  return { Success: true, message: "Comment is liked" };
};

const replyComment = async (commentId, userId, body) => {
  console.log("*-*-*-*userId-*-*-*", userId, " body:  ", body);
  await getSingle(commentId);
  const newReply = await CommentModel.create({ ...body });

  //await create(body, userId);

  console.log("*-*-*-*-*-*-*", newReply);
  const doc = await CommentModel.updateOne(
    { _id: commentId },
    { $push: { replies: newReply._id } }
  );
  return { Success: true, Response: doc };
};

module.exports = {
  create,
  getSingle,
  updateOne,
  deleteSingle,
  likeAComment,
  replyComment,
};
