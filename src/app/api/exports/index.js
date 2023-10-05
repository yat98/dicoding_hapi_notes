/* c8 ignore next 2 */
import ExportHandler from './handler.js';
import {routes} from './routes.js';

export default {
  name: 'exports',
  version: '1.0.0',
  // eslint-disable-next-line require-await
  register: async (server, {service, validator}) => {
    const exportHandler = new ExportHandler(service);
    server.route(routes(exportHandler, validator));
  },
};
