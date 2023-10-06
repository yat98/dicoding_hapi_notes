/* eslint-disable max-len */
/* c8 ignore next 3*/
// import notesRoute from '../routes/notes.js';
// import NotesService from '../services/inMemory/NotesService.js';
// import notesModel from '../models/notes.js';

import Hapi from '@hapi/hapi';
import notes from './api/notes/index.js';
import users from './api/users/index.js';
import authentications from './api/authentications/index.js';
import collaborations from './api/collaborations/index.js';
import _exports from './api/exports/index.js';
import uploads from './api/uploads/index.js';
import NotesService from '../services/postgres/NotesService.js';
import UsersService from '../services/postgres/UsersService.js';
import AuthenticationService from '../services/postgres/AuthenticationService.js';
import CollaborationsService from '../services/postgres/CollaborationsService.js';
import ProducerService from '../services/rabbitmq/ProducerService.js';
import StorageService from '../services/storage/StorageService.js';
import notesValidator from '../validators/notes/index.js';
import usersValidator from '../validators/users/index.js';
import collaborationsValidator from '../validators/collaborations/index.js';
import authenticationsValidator from '../validators/authentications/index.js';
import exportsValidator from '../validators/exports/index.js';
import uploadsValidator from '../validators/uploads/index.js';
import app from '../config/app.js';
import Jwt from '@hapi/jwt';
import token from '../config/token.js';
import TokenManager from './tokenize/TokenManager.js';
import path from 'path';
import * as url from 'url';
import Inert from '@hapi/inert';
import CacheService from '../services/redis/CacheService.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
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

/* c8 ignore next 76 */
// server.route([
//   ...notesRoute,
// ]);

const registerPlugin = async () => {
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService(cacheService);
  const notesService = new NotesService(collaborationsService, cacheService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
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
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: authenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: collaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: exportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: uploadsValidator,
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
