import ClientError from '../../../exceptions/ClientError.js';

class CollaborationsHandler {
  constructor(collaborationsService, notesService) {
    this._collaborationsService = collaborationsService;
    this._notesService = notesService;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler
        .bind(this);
  }

  async postCollaborationHandler(req, h) {
    try {
      const {id: credentialId} = req.auth.credentials;
      const {noteId, userId} = req.payload;
      await this._notesService.verifyNoteOwner(noteId, credentialId);
      const collaborationId = await this._collaborationsService
          .addCollaboration(noteId, userId);

      return h.response({
        status: 'success',
        message: 'success add collaboration',
        data: {
          collaborationId,
        },
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

  async deleteCollaborationHandler(req, h) {
    try {
      const {id: credentialId} = req.auth.credentials;
      const {noteId, userId} = req.payload;
      await this._notesService.verifyNoteOwner(noteId, credentialId);
      const collaborationId = await this._collaborationsService
          .deleteCollaboration(noteId, userId);

      return h.response({
        status: 'success',
        message: 'success delete collaboration',
        data: {
          collaborationId,
        },
      });
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
}

export default CollaborationsHandler;
