import Joi from 'joi';

const ExportPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({tlds: true}).required(),
});

export default ExportPayloadSchema;
