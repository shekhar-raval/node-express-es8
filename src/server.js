const http = require('http');
const app = require('./config/express');
const { env, port } = require('./config/env-vars');
const { Connect } = require('./config/mongoose');

// Create Http Server
const server = http.createServer(app);

server.listen(port);

server.on('listening', () => {
  Connect();
  console.log(`${env.toUpperCase()} Server is Listening on PORT ${port}`);
});

// Listen to error on listening to port
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};
server.on('error', onError);

/**
 * Exports Express
 * @public
 */
module.exports = server;
