import {schemaOption} from '../schema.js';
import failHandler from '../../handlers/fail.js';
import ExportPayloadSchema from './schema.js';

const addExportValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: ExportPayloadSchema,
};

export default {
  addExportValidation,
};
