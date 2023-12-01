const express = require("express");
const router = express.Router();

const { userController } = require("../controller");

const validate = require("../middleware/validate");
const { userValidator } = require("../validation");

const auth = require("../middleware/auth");

router.post("/signup", validate(userValidator.create), userController.create);

router.post("/login", validate(userValidator.login), userController.login);

router.get("/:email", auth.authorize, userController.getSingle);

router.post(
  "/sendRequest",
  auth.authorize,
  validate(userValidator.email),
  userController.sendFriendRequest
);

router.post(
  "/acceptRequest",
  auth.authorize,
  validate(userValidator.id),
  userController.acceptRequest
);

router.post(
  "/rejectRequest",
  auth.authorize,
  validate(userValidator.id),
  userController.rejectRequest
);

router.post(
  "/follow",
  auth.authorize,
  validate(userValidator.id),
  userController.follow
);

router.post(
  "/unfollow",
  auth.authorize,
  validate(userValidator.id),
  userController.unfollow
);

module.exports = router;
