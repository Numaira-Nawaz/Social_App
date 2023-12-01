const { UserModel } = require("../../models");
const { userService } = require("..");
const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const { ObjectId } = require("mongoose").Types;

const updateRelationship = async (receiverId, update) => {
  return await UserModel.updateOne({ _id: receiverId }, update);
};

const sendFriendRequest = async (senderId, receiverEmail) => {
  const receiver = await userService.getSingle(receiverEmail);

  if (receiver._id.toString() === senderId.toString()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Receiver and sender must be different"
    );
  }

  const existInRequests = await UserModel.exists({
    _id: receiver._id,
    friendRequests: senderId,
  });

  if (existInRequests) {
    throw new ApiError(httpStatus.CONFLICT, "Request Already sent");
  }

  const existInFriends = await UserModel.exists({
    _id: receiver._id,
    friends: senderId,
  });
  console.log("existInFriends: ", existInFriends);

  if (existInFriends) {
    throw new ApiError(httpStatus.CONFLICT, "User Already in the FriendList");
  }

  const existInFollowers = await UserModel.exists({
    followers: senderId,
  });

  const update = existInFollowers
    ? { $push: { friendRequests: senderId } }
    : { $push: { followers: senderId, friendRequests: senderId } };

  const doc = await updateRelationship(receiver._id, update);

  return {
    message: "Friend Request Sent Successfully",
    Response: doc,
  };
};

const acceptRequest = async (senderId, receiverId) => {
  const existInFriends = await UserModel.exists({
    _id: receiverId,
    friends: senderId,
  });

  if (existInFriends) {
    throw new ApiError(httpStatus.CONFLICT, "User Already in the FriendList");
  }

  const update = {
    $push: { friends: senderId },
    $pull: { friendRequests: senderId },
  };
  const doc = await updateRelationship(receiverId, update);

  return {
    message: "You both are friends now.",
    Response: doc,
  };
};

const rejectRequest = async (senderId, receiverId) => {
  const exist = await UserModel.exists({
    _id: receiverId,
    friendRequests: senderId,
  });

  if (!exist) {
    throw new ApiError(httpStatus.CONFLICT, "There is no friend request");
  }

  const doc = await updateRelationship(receiverId, {
    $pull: { friendRequests: senderId },
  });

  return {
    message: "Friend request is rejected.",
    Response: doc,
  };
};

const follow = async (receiverId, senderId) => {
  const exist = await UserModel.exists({
    _id: receiverId,
    followers: senderId,
  });

  if (exist) {
    throw new ApiError(httpStatus.CONFLICT, "Already Followed");
  }

  const doc = await updateRelationship(receiverId, {
    $push: { followers: senderId },
  });

  return {
    message: "You followed successfully.",
    Response: doc,
  };
};

const unfollow = async (receiverId, senderId) => {
  const exist = await UserModel.exists({
    _id: receiverId,
    followers: senderId,
  });

  if (!exist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User is not currently being followed. Unable to unfollow."
    );
  }

  const doc = await updateRelationship(receiverId, {
    $pull: { followers: senderId },
  });

  return {
    message: "You unfollowed successfully.",
    Response: doc,
  };
};

module.exports = {
  sendFriendRequest,
  acceptRequest,
  rejectRequest,
  follow,
  unfollow,
};
