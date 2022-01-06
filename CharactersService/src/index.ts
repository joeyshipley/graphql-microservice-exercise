import startServer from './server';
import { ENV } from './server/environment-variables';

const PORT = ENV.PORT;
const DBHOST = ENV.DBHOST;
const DBNAME = ENV.DBNAME;

startServer({
  port: PORT,
  dbHost: DBHOST,
  dbName: DBNAME
}).catch((error) => {
  console.log(error, 'error');
});
