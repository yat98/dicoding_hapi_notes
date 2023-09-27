import {schemaOption} from '../schema.js';
import failHandler from '../../handlers/fail.js';
import UserPayloadSchema from './schema.js';

const addUserValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: UserPayloadSchema,
};

export default {
  addUserValidation,
};
