import ClientError from '../../../exceptions/ClientError.js';

class NotesHandler {
  constructor(service) {
    this._service = service;
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.destroyNoteByIdHandler = this.destroyNoteByIdHandler.bind(this);
  }

  async postNoteHandler(req, h) {
    const {title, body, tags} = req.payload;
    const {id: credentialId} = req.auth.credentials;
    const noteId = await this._service.addNote({
      title, body, tags, owner: credentialId,
    });

    return h.response({
      status: 'success',
      message: 'success add note',
      data: {
        noteId,
      },
    }).code(201);
  }

  async getNotesHandler(req, h) {
    const {id: credentialId} = req.auth.credentials;
    const notes = await this._service.getNote(credentialId);
    return h.response({
      status: 'success',
      data: {
        notes,
      },
    });
  }

  async getNoteByIdHandler(req, h) {
    try {
      const {id} = req.params;
      const {id: credentialId} = req.auth.credentials;
      await this._service.verifyNoteOwner(id, credentialId);
      const note = await this._service.getNoteById(id);
      return h.response({
        status: 'success',
        data: {
          note,
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

  async putNoteByIdHandler(req, h) {
    try {
      const {id} = req.params;
      const {id: credentialId} = req.auth.credentials;
      await this._service.verifyNoteOwner(id, credentialId);
      await this._service.editNoteById(id, req.payload);

      return h.response({
        status: 'success',
        message: 'success update note',
      }).code(200);
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

  async destroyNoteByIdHandler(req, h) {
    try {
      const {id} = req.params;
      const {id: credentialId} = req.auth.credentials;
      await this._service.verifyNoteOwner(id, credentialId);
      await this._service.deleteNoteById(id);

      return h.response({
        status: 'success',
        message: 'success delete note',
      }).code(200);
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

export default NotesHandler;
