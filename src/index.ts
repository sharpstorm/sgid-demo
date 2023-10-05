import express from 'express';
import cookieParser from 'cookie-parser';
import { setupRoutes } from './routes';
import { loadConfig } from './config';

const serverConfig = loadConfig();

const server = express();
server.use(cookieParser(serverConfig.cookieSecret));

setupRoutes(server, serverConfig);

// Listen on PORT
console.log(`listening on ${serverConfig.port}`);
server.listen({
  port: serverConfig.port,
});
