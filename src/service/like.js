const { LikeModel } = require("../models");
const { postService } = require("../service");

const doLike = async (type, user, postId) => {
  console.log("-------------------");
  const post = await postService.getSingle(postId);
  console.log("POST: ", post);
  const result = await LikeModel.create({ type, comment: null, post, user });
  console.log("Result: ", result);

  return {
    success: true,
    Response: result,
  };
};

module.exports = {
  doLike,
};
