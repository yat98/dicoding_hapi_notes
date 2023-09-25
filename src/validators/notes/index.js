import NotePayloadSchema from './schema.js';
import {schemaOption} from '../schema.js';
import failHandler from '../../handlers/fail.js';

const addNoteValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: NotePayloadSchema,
};

const updateNoteValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: NotePayloadSchema,
};

export default {
  addNoteValidation,
  updateNoteValidation,
};
