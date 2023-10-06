import app from '../../../config/app.js';
import ClientError from '../../../exceptions/ClientError.js';

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(req, h) {
    try {
      const {data} = req.payload;
      await this._validator.addUploadImageValidation(data.hapi.headers);
      const filename = await this._service.writeFile(data, data.hapi);

      return h.response({
        status: 'success',
        data: {
          fileLocation: `http://${app.host}:${app.port}/upload/images/${filename}`,
        },
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      console.log(error);
      /* c8 ignore next 4 */
      return h.response({
        status: 'fail',
        message: 'server error',
      }).code(500);
    }
  }
}

export default UploadsHandler;
