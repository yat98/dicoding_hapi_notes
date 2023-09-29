export const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/notes',
    handler: handler.postNoteHandler,
    options: {
      auth: 'notesapp_jwt',
      validate: validator.addNoteValidation,
    },
  },
  {
    method: 'GET',
    path: '/notes',
    handler: handler.getNotesHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: handler.getNoteByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: handler.putNoteByIdHandler,
    options: {
      auth: 'notesapp_jwt',
      validate: validator.updateNoteValidation,
    },
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: handler.destroyNoteByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];
