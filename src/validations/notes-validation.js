import Joi from 'joi';
import {schemaOption} from './validate.js';
import failHandler from '../handlers/fail.js';

const addNoteValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: Joi.object({
    title: Joi.string().max(255).required(),
    tags: Joi.array().required(),
    body: Joi.string().required(),
  }),
};

const updateNoteValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: Joi.object({
    title: Joi.string().max(255).required(),
    tags: Joi.array().required(),
    body: Joi.string().required(),
  }),
};

export {
  addNoteValidation,
  updateNoteValidation,
};
