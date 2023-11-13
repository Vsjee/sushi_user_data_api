require('dotenv').config();

import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Server from './app/server';

import router from './app/api';

const server = new Server();

// Config
server.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
server.app.use(bodyParser.json({ limit: '50mb' }));
server.app.use(cors());

server.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message });
  }

  res.status(500).send({ error: err.message });
});

// API Base Route Handler
server.app.get('/', function (req, res) {
  res.send('Sushi users API has been Initialized');
});

// API Handler
server.app.use('/api/v1', router);

// Error handler
function handleFatalError(err: any) {
  console.error(`'[Fatal Error]: '${err.message}`);
  console.error(err.stack);
}

if (!module.parent) {
  process.on('uncaughtException', handleFatalError);
  process.on('unhandledRejection', handleFatalError);

  server.start(() => {
    console.log(`Server listening in port ${server.port}`);
  });
}
