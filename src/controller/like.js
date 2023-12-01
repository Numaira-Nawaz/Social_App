const { likeService } = require("../service");
const catchAsync = require("../utils/catchAsync");

const doLike = catchAsync(async (req, res) => {
  //const { body, userData, postId } = req;
  console.log(
    // "Body: ",
    // body,
    " user: ",
    req.userData,
    " postId: ",
    req.body.postId
  );
  const result = await likeService.doLike(
    req.body.type,
    req.userData,
    req.body.postId
  );
  res.json({ Response: result });
});

module.exports = {
  doLike,
};
