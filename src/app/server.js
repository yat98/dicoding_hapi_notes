/* c8 ignore next 3*/
// import notesRoute from '../routes/notes.js';
// import NotesService from '../services/inMemory/NotesService.js';
// import notesModel from '../models/notes.js';
import Hapi from '@hapi/hapi';
import notes from './api/notes/index.js';
import NotesService from '../services/postgres/NotesService.js';
import notesValidator from '../validators/notes/index.js';
import app from '../config/app.js';

const server = Hapi.server({
  host: app.host,
  port: app.port,
  routes: {
    cors: {
      origin: [
        '*',
      ],
    },
  },
});

/* c8 ignore next 3 */
// server.route([
//   ...notesRoute,
// ]);

const registerPlugin = async () => {
  const notesService = new NotesService();
  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: notesValidator,
    },
  });
};

/* c8 ignore next 11 */
const init = async () => {
  await registerPlugin();
  await server.initialize();
  return server;
};

const start = async () => {
  await registerPlugin();
  await server.start();
  console.info(`Server listen on ${server.info.uri}`);
};

export default {
  init,
  start,
};
