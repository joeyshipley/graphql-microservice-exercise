import startServer from './server';

const PORT = process.env.PORT;
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

startServer({
  port: PORT,
  dbHost: DBHOST,
  dbName: DBNAME
}).catch((error) => {
  console.log(error, 'error');
});
