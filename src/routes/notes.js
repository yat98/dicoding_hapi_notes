import notesHandler from '../handlers/notes.js';
import {addNoteValidation} from '../validations/notes-validation.js';

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
];

export default notesRoute;
