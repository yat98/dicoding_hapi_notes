export const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/notes',
    handler: handler.postNoteHandler,
    options: {
      validate: validator.addNoteValidation,
    },
  },
  {
    method: 'GET',
    path: '/notes',
    handler: handler.getNotesHandler,
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: handler.getNoteByIdHandler,
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: handler.putNoteByIdHandler,
    options: {
      validate: validator.updateNoteValidation,
    },
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: handler.destroyNoteByIdHandler,
  },
];
