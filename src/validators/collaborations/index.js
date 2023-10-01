import CollaborationPayloadSchema from './schema.js';
import {schemaOption} from '../schema.js';
import failHandler from '../../handlers/fail.js';

const addCollaborationValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: CollaborationPayloadSchema,
};

const deleteCollaborationValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: CollaborationPayloadSchema,
};

export default {
  addCollaborationValidation,
  deleteCollaborationValidation,
};
