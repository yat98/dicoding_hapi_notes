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
];

export default notesRoute;
