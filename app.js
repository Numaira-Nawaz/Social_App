const dotenv = require("dotenv");
const path = require("path");

const express = require("express");

const { connect } = require("./src/db/index");

const likeRouter = require("./src/routes/like");
const userRouter = require("./src/routes/user");
const postRouter = require("./src/routes/post");
const commentRouter = require("./src/routes/comment");

const cors = require("cors");
const app = express();

dotenv.config({ path: path.join(__dirname, ".env") });

const { errorHandler } = require("./src/middleware/error");

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "100mb", extended: true }));
app.use(cors());

// Middleware to log URL and request type
app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
  console.log(`|Full-URL,  Request-Type|   ::   |${fullUrl},  ${req.method}|`);
  next();
});

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/like", likeRouter);
app.use("/comment", commentRouter);

app.get("/", function (req, res) {
  res.send({
    title: "Welcome to Fiixit",
  });
});
app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connect();
  console.log(`Server is running ${PORT}`);
});

module.exports = app;
