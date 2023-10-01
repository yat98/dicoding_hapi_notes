/* c8 ignore next 2 */
import {routes} from './routes.js';
import CollaborationsHandler from './handler.js';

export default {
  name: 'collaborations',
  version: '1.0.0',
  // eslint-disable-next-line require-await
  register: async (server, {
    collaborationsService, notesService, validator},
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
        collaborationsService, notesService,
    );
    server.route(routes(collaborationsHandler, validator));
  },
};
