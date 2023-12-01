const httpStatus = require("http-status");
const { UserModel } = require("../models");

const ApiError = require("../utils/ApiError");

const generateToken = require("../utils/jwt");
/**
 *
 * @param {string} body
 * @returns {Object}
 * @throws {ApiError}
 */
const create = async (body) => {
  if (
    await UserModel.findOne({
      $or: [{ email: body.email }, { userName: body.userName }],
    })
  ) {
    throw new ApiError(httpStatus.CONFLICT, "User Already Exist.");
  }
  const result = await UserModel.create({ ...body });
  return { success: true, Response: result };
};

const getSingle = async (email) => {
  const result = await UserModel.findOne({ email });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Resource not found.");
  }
  return result;
};

const login = async (email, password) => {
  console.log("Password: ", password);
  const doc = await getSingle(email);
  if (!doc || !(await doc.isPasswordMatch(password))) {
    throw ApiError(httpStatus.UNAUTHORIZED, "Incorrect username or password");
  }
  const jwt = await generateToken(doc);
  return { jwtToken: jwt };
};

module.exports = {
  create,
  getSingle,
  login,
};
