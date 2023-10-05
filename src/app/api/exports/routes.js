export const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/export/notes',
    handler: handler.postExportNotesHandler,
    options: {
      auth: 'notesapp_jwt',
      validate: validator.addExportValidation,
    },
  },
];

export default routes;
