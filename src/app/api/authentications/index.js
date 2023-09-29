/* c8 ignore next 2 */
import {routes} from './routes.js';
import AuthenticationHandler from './handler.js';

export default {
  name: 'authentications',
  version: '1.0.0',
  // eslint-disable-next-line require-await
  register: async (server, {
    authenticationService, userService, tokenManager, validator,
  }) => {
    const authenticationHandler = new AuthenticationHandler(
        authenticationService, userService, tokenManager,
    );
    server.route(routes(authenticationHandler, validator));
  },
};
