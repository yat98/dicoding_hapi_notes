import AuthenticationPayloadSchema from './schema.js';
import {schemaOption} from '../schema.js';
import failHandler from '../../handlers/fail.js';

const addAuthenticationValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: AuthenticationPayloadSchema.PostAuthenticationsPayloadSchema,
};

const updateAuthenticationValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: AuthenticationPayloadSchema.PutAuthenticationsPayloadSchema,
};

const deleteAuthenticationValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: AuthenticationPayloadSchema.DeleteAuthenticationsPayloadSchema,
};

export default {
  addAuthenticationValidation,
  updateAuthenticationValidation,
  deleteAuthenticationValidation,
};

