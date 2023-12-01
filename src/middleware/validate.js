const Joi = require("joi");
const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  let data = { ...req.body };
  if (req.headers["content-type"] !== "application/json;charset=UTF-8")
    if (Object.keys(data).length > 0) {
      for (let key in data) {
        try {
          data[key] = JSON.parse(data[key]);
        } catch (error) {
          continue;
        }
      }
    }

  req.body = data;
  //console.log(req.body);
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
