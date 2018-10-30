const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./src/router/api/admin.api');
const serverConfig = require('./config/server-config')(process.env.NODE_ENV);

const app = express();
const { port, mode } = serverConfig;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', adminRouter);

// 404 Error
app.use((_req, res, _next) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port} with mode ${mode}`);
});
