import * as express from 'express';
import * as bodyparser from 'body-parser';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as logger from 'morgan';

import {
  routerUsers,
} from './routes';

require('dotenv').config();

const app: express.Application = express();

app.use(logger('dev'));
app.use(bodyparser.json());

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/altex';

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;

// TODO RESTART SERVER ON ERROR?
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  // we're connected!
  console.log('CONNECTED TO DBb. SERVER RUNNING ON PORT 5000');

  app.use(cors());
  app.get('/', (_req, res) => res.send('ALTEX api working with email!'));
  app.use('/api/users', routerUsers);
});

export default app;