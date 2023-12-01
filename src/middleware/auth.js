var jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "numaira-nawaz";

const { UserModel } = require("../models");

module.exports = {
  authorize: async (req, res, next) => {
    try {
      const decoded = jwt.verify(
        req.headers.authorization.split(" ")[1],
        jwtSecret
      );

      // console.log("hello ");

      req.userData = decoded;
      //req.user = decoded;

      req.userData = await UserModel.findById(req.userData.userId);

      next();
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  },
};
