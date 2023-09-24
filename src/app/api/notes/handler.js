export class NotesHandler {
  constructor(service) {
    this._service = service;
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.destroyNoteByIdHandler = this.destroyNoteByIdHandler.bind(this);
  }

  postNoteHandler(req, h) {
    const {title = 'untitled', body, tags} = req.payload;
    const noteId = this._service.addNote({title, body, tags});

    return h.response({
      status: 'success',
      message: 'success add note',
      data: {
        noteId,
      },
    }).code(201);
  }

  getNotesHandler(req, h) {
    const notes = this._service.getNote();
    return h.response({
      status: 'success',
      data: {
        notes,
      },
    });
  }

  getNoteByIdHandler(req, h) {
    try {
      const {id} = req.params;
      const note = this._service.getNoteById(id);
      return h.response({
        status: 'success',
        data: {
          note,
        },
      });
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
  }

  putNoteByIdHandler(req, h) {
    try {
      const {id} = req.params;
      this._service.editNoteById(id, req.payload);

      return h.response({
        status: 'success',
        message: 'success update note',
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
  }

  destroyNoteByIdHandler(req, h) {
    try {
      const {id} = req.params;
      this._service.deleteNoteById(id);

      return h.response({
        status: 'success',
        message: 'success delete note',
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
  }
}
