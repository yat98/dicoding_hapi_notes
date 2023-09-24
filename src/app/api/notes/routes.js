export const routes = (handler) => [
  {
    method: 'POST',
    path: '/notes',
    handler: handler.postNoteHandler,
    // options: {
    //   validate: validation.addNoteValidation,
    // },
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
    // options: {
    //   validate: validation.updateNoteValidation,
    // },
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: handler.destroyNoteByIdHandler,
  },
];
