const { commentService } = require("../service");

const catchAsync = require("../utils/catchAsync");

const create = catchAsync(async (req, res) => {
  const result = await commentService.create(req.body, req.userData);
  res.json({
    Response: result,
  });
});

const getSingle = catchAsync(async (req, res) => {
  const result = await commentService.getSingle(req.params.id);
  res.json({
    Response: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await commentService.updateOne(req.params.id, req.body);
  res.json({ Response: result });
});

const deleteSingle = catchAsync(async (req, res) => {
  const result = await commentService.deleteSingle(req.params.id);
  restart.json({
    Response: result,
  });
});

const likeAComment = catchAsync(async (req, res) => {
  console.log("CommentId: ", req.params.id, "  userId:", req.userData._id);
  const result = await commentService.likeAComment(
    req.params.id,
    req.userData._id
  );
  res.json({
    Response: result,
  });
});

const replyComment = catchAsync(async (req, res) => {
  const result = await commentService.replyComment(
    req.params.id,
    req.userData,
    req.body
  );
  res.json({
    Response: result,
  });
});

module.exports = {
  create,
  getSingle,
  updateOne,
  deleteSingle,
  likeAComment,
  replyComment,
};
