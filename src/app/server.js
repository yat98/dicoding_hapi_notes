/* c8 ignore next 2 */
import 'dotenv/config';
// import notesRoute from '../routes/notes.js';
import Hapi from '@hapi/hapi';
import notes from './api/notes/index.js';
import NotesService from '../services/inMemory/NotesService.js';
import notesModel from '../models/notes.js';

const host = process.env.HOST;
const port = process.env.PORT;

const server = Hapi.server({
  host,
  port,
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
  const notesService = new NotesService(notesModel);
  await server.register({
    plugin: notes,
    options: {
      service: notesService,
    },
  });
};

/* c8 ignore next 9 */
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
