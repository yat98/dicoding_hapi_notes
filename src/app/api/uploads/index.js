/* c8 ignore next 2 */
import UploadsHandler from './handler.js';
import {routes} from './routes.js';

export default {
  name: 'uploads',
  version: '1.0.0',
  // eslint-disable-next-line require-await
  register: async (server, {service, validator}) => {
    const uploadHandler = new UploadsHandler(service, validator);
    server.route(routes(uploadHandler));
  },
};
