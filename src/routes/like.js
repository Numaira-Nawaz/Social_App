const express = require("express");
const router = express.Router();

const { likeController } = require("../controller");

const auth = require("../middleware/auth");

router.post("/", auth.authorize, likeController.doLike);

module.exports = router;
