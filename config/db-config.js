const mode = process.env.NODE_ENV;
let connectionConfig;

if (mode === 'local') {
  // Development mode
  connectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    insecureAuth: true,
    database: 'ufinityplwai',
  };
} else if (mode === 'test') {
  // Test mode
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

module.exports = connectionConfig;
