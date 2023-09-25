/* c8 ignore next 2 */
import {routes} from './routes.js';
import NotesHandler from './handler.js';

export default {
  name: 'notes',
  version: '1.0.0',
  // eslint-disable-next-line require-await
  register: async (server, {service, validator}) => {
    const noteHandler = new NotesHandler(service);
    server.route(routes(noteHandler, validator));
  },
};
