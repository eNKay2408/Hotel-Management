import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  driver: 'mssql',
  pool: {
    max: 20,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const connection = new sql.ConnectionPool(sqlConfig);

export default connection;
