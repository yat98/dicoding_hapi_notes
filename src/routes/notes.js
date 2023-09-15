/* eslint-disable max-len */
import notesHandler from '../handlers/notes.js';
import {addNoteValidation, updateNoteValidation} from '../validations/notes-validation.js';

const notesRoute = [
  {
    method: 'POST',
    path: '/notes',
    handler: notesHandler.add,
    options: {
      validate: addNoteValidation,
    },
  },
  {
    method: 'GET',
    path: '/notes',
    handler: notesHandler.index,
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: notesHandler.show,
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: notesHandler.update,
    options: {
      validate: updateNoteValidation,
    },
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: notesHandler.destroy,
  },
];

export default notesRoute;
