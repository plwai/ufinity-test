const express = require('express');
const serverConfig = require('./config/server-config')(process.env.NODE_ENV);

const app = express();
const router = express.Router();
const { port, mode } = serverConfig;

router.get('/', (req, res, next) => {
  res.send('home page');
});

app.use('/', router);

app.listen(port, () => {
  console.log(`Listening on port ${port} with mode ${mode}`);
});
