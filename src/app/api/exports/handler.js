class ExportHandler {
  constructor(service) {
    this._service = service;
    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(req, h) {
    try {
      const {id: userId} = req.auth.credentials;
      const {targetEmail} = req.payload;
      const message = {userId, targetEmail};
      await this._service.sendMessage('export:notes', JSON.stringify(message));
      return h.response({
        status: 'success',
        message: 'your request on queue',
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      /* c8 ignore next 4 */
      return h.response({
        status: 'fail',
        message: 'server error',
      }).code(500);
    }
  }
};

export default ExportHandler;
