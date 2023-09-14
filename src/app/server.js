/* c8 ignore next */
import 'dotenv/config';
import Hapi from '@hapi/hapi';

const host = process.env.HOST;
const port = process.env.PORT;

const server = Hapi.server({
  host,
  port,
});

const init = async () => {
  await server.initialize();
  return server;
};

const start = async () => {
  await server.start();
  console.info(`Server listen on ${server.info.uri}`);
};

export default {
  init,
  start,
};
