const express = require("express");
const router = express.Router();

const { commentController } = require("../controller");
const { commentValidator } = require("../validation");

const { auth, validate } = require("../middleware");

router.post(
  "/",
  auth.authorize,
  validate(commentValidator.create),
  commentController.create
);
router.post(
  "/like/:id",
  auth.authorize,
  validate(commentValidator.get),
  commentController.likeAComment
);
router.post(
  "/reply/:id",
  validate(commentValidator.get),
  auth.authorize,
  commentController.replyComment
);

router
  .route("/:id")
  .get(
    auth.authorize,
    validate(commentValidator.get),
    commentController.getSingle
  )
  .patch(
    auth.authorize,
    validate(commentValidator.update),
    commentController.updateOne
  )
  .delete(
    auth.authorize,
    validate(commentValidator.get),
    commentController.deleteSingle
  );

module.exports = router;
