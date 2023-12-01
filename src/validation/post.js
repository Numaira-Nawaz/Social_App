const Joi = require("joi");
const { objectId } = require("./custome");

const create = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
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
    title: Joi.string().optional(),
    body: Joi.string().optional(),
  }),
};

const id = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  create,
  get,
  update,
  id,
};
