/* c8 ignore next 2 */
import UserHandler from './handler.js';
import {routes} from './routes.js';

export default {
  name: 'users',
  version: '1.0.0',
  // eslint-disable-next-line require-await
  register: async (server, {service, validator}) => {
    const userHandler = new UserHandler(service);
    server.route(routes(userHandler, validator));
  },
};
