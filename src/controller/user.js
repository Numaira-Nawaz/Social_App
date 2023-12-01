const { userService, userFriends } = require("../service");
const catchAsync = require("../utils/catchAsync");

const create = catchAsync(async (req, res) => {
  const result = await userService.create(req.body);
  res.json({ Response: result });
});

const login = catchAsync(async (req, res) => {
  const result = await userService.login(req.body.email, req.body.password);
  res.json({
    Response: result,
  });
});

const getSingle = catchAsync(async (req, res) => {
  const result = await userService.getSingle(req.params.email);
  res.json({
    Response: result,
  });
});

const sendFriendRequest = catchAsync(async (req, res) => {
  const result = await userFriends.sendFriendRequest(
    req.userData._id,
    req.body.email
  );
  res.json({ result });
});

const acceptRequest = catchAsync(async (req, res) => {
  const result = await userFriends.acceptRequest(req.body.id, req.userData._id);
  res.json({ result });
});

const rejectRequest = catchAsync(async (req, res) => {
  const result = await userFriends.rejectRequest(req.body.id, req.userData._id);
  res.json({ result });
});

const follow = catchAsync(async (req, res) => {
  //console.log("-----userData: ", req.userData, " body: ", req.body.id);
  const result = await userFriends.follow(req.body.id, req.userData._id);
  res.json({
    result,
  });
});

const unfollow = catchAsync(async (req, res) => {
  const result = await userFriends.unfollow(req.userData._id, req.body.id);
  res.json({
    result,
  });
});

module.exports = {
  create,
  login,
  getSingle,
  sendFriendRequest,
  acceptRequest,
  rejectRequest,
  follow,
  unfollow,
};
