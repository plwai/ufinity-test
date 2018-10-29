const mode = process.env.NODE_ENV;
const isSeed = process.env.SEED_ENV;
let connectionConfig;

if (mode === 'local') {
  // Development mode
  connectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    insecureAuth: true,
  };
} else if (mode === 'test') {
  connectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    insecureAuth: true,
    database: 'ufinityplwaitest',
  };
} else {
  // Production mode
  connectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    insecureAuth: true,
  };
}

if (isSeed !== 'yes' && mode !== 'test') {
  connectionConfig.database = 'ufinityplwai';
}

module.exports = connectionConfig;
