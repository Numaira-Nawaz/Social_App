const Joi = require("joi");
const { objectId } = require("./custome");

const create = {
  body: Joi.object().keys({
    body: Joi.string().required(),
    postId: Joi.string().custom(objectId).required(),
  }),
};

const get = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const update = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),

  body: Joi.object().keys({
    body: Joi.string().optional(),
  }),
};

module.exports = {
  create,
  get,
  update,
};
