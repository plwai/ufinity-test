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

if (isSeed !== 'yes') {
  connectionConfig.database = 'ufinityplwai';
}

module.exports = connectionConfig;
