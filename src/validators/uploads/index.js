import InvariantError from '../../exceptions/InvariantError.js';
import UploadPayloadSchema from './schema.js';

const addUploadImageValidation = (headers) => {
  const result = UploadPayloadSchema.validate(headers);
  if (result.error) throw new InvariantError(result.error.message);
};

export default {
  addUploadImageValidation,
};
