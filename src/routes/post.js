const express = require("express");
const router = express.Router();

const { postController } = require("../controller");

const { auth, validate } = require("../middleware");
const { postValidator } = require("../validation");

router
  .route("/")
  .post(auth.authorize, validate(postValidator.create), postController.create)
  .get(auth.authorize, validate(postValidator.get), postController.get);

router.post(
  "/like",
  auth.authorize,
  validate(postValidator.id),
  postController.likeAPost
);
router.post(
  "/removeLike",
  auth.authorize,
  validate(postValidator.id),
  postController.removeLike
);
router.get("/totalLikes", auth.authorize, postController.countLike);

router
  .route("/:id")
  .get(auth.authorize, validate(postValidator.get), postController.getSingle)
  .patch(
    auth.authorize,
    validate(postValidator.update),
    postController.updateOne
  )
  .delete(
    auth.authorize,
    validate(postValidator.get),
    postController.deleteSingle
  );

module.exports = router;
