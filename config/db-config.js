const port = process.env.NODE_ENV;
let connectionConfig;

if (port === 3000) {
  // Development mode
  connectionConfig = {
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: '',
    database: 'ufinity-dev',
    insecureAuth: true,
  };
} else {
  // Production mode
  connectionConfig = {
    host: 'localhost',
    port: 5001,
    user: 'root',
    password: '',
    database: 'ufinity-release',
    insecureAuth: true,
  };
}

module.exports = connectionConfig;
