/* eslint-disable max-len */
/* c8 ignore next 3*/
// import notesRoute from '../routes/notes.js';
// import NotesService from '../services/inMemory/NotesService.js';
// import notesModel from '../models/notes.js';

import Hapi from '@hapi/hapi';
import notes from './api/notes/index.js';
import users from './api/users/index.js';
import authentications from './api/authentications/index.js';
import NotesService from '../services/postgres/NotesService.js';
import UsersService from '../services/postgres/UsersService.js';
import AuthenticationService from '../services/postgres/AuthenticationService.js';
import notesValidator from '../validators/notes/index.js';
import usersValidator from '../validators/users/index.js';
import authenticationsValidator from '../validators/authentications/index.js';
import app from '../config/app.js';
import Jwt from '@hapi/jwt';
import token from '../config/token.js';
import TokenManager from './tokenize/TokenManager.js';

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

/* c8 ignore next 67 */
// server.route([
//   ...notesRoute,
// ]);

const registerPlugin = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationService();

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: token.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: token.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      creadentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: notesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: usersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationService: authenticationsService,
        userService: usersService,
        tokenManager: TokenManager,
        validator: authenticationsValidator,
      },
    },
  ]);
};

const start = async (opts) => {
  await registerPlugin();
  if (opts.start) {
    await server.start();
    console.info(`Server listen on ${server.info.uri}`);
  } else if (opts.test) {
    await server.initialize();
  }
  return server;
};

export default {
  start,
};
