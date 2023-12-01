const { postService } = require("../service");
const catchAsync = require("../utils/catchAsync");

const create = catchAsync(async (req, res) => {
  console.log("USER: ", req.userData);
  const result = await postService.create(req.body, req.userData._id);
  res.json({
    response: result,
  });
});

const getSingle = catchAsync(async (req, res) => {
  console.log("params: ", req.params.id);
  const result = await postService.getSingle(req.params.id);
  res.json({
    Response: result,
  });
});

const get = catchAsync(async (req, res) => {
  //console.log("UserId: ", req.userData._id);

  const result = await postService.get(
    req.userData._id,
    req.query.pageNum,
    req.query.pageSize
  );
  res.json({
    Response: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await postService.updateOne(req.params.id, req.body);
  res.json({ Response: result });
});

const deleteSingle = catchAsync(async (req, res) => {
  const result = await postService.deleteSingle(req.params.id);
  res.json({
    Response: result,
  });
});

const likeAPost = catchAsync(async (req, res) => {
  console.log(" PostId: ", req.body.postId, " user: ", req.userData._id);
  const result = await postService.likeAPost(req.body.postId, req.userData._id);
  return res.json({
    Response: result,
  });
});

const removeLike = catchAsync(async (req, res) => {
  console.log("---------", req.userData);
  const result = await postService.removeLike(
    req.body.postId,
    req.userData._id
  );
  res.json({
    response: result,
  });
});

const countLike = catchAsync(async (req, res) => {
  const result = await postService.countLike(req.body.postId);
  res.json({
    Response: result,
  });
});

module.exports = {
  create,
  getSingle,
  get,
  updateOne,
  deleteSingle,
  likeAPost,
  removeLike,
  countLike,
};
