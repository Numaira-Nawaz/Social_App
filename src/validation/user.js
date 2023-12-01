const Joi = require("joi");
const { objectId } = require("./custome");

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const id = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const email = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

module.exports = {
  create,
  login,
  id,
  email,
};
