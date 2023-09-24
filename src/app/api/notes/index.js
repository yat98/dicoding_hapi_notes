import {NotesHandler} from './handler.js';
import {routes} from './routes.js';

export default {
  name: 'notes',
  version: '1.0.0',
  // eslint-disable-next-line require-await
  register: async (server, {service}) => {
    const noteHandler = new NotesHandler(service);
    server.route(routes(noteHandler));
  },
};
