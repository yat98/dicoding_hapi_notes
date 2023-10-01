/* c8 ignore next 2 */
import {routes} from './routes.js';
import AuthenticationHandler from './handler.js';

export default {
  name: 'authentications',
  version: '1.0.0',
  // eslint-disable-next-line require-await
  register: async (server, {
    authenticationsService, usersService, tokenManager, validator,
  }) => {
    const authenticationHandler = new AuthenticationHandler(
        authenticationsService, usersService, tokenManager,
    );
    server.route(routes(authenticationHandler, validator));
  },
};
