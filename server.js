const express = require('express');
const adminRouter = require('./src/router/api/administrative');
const serverConfig = require('./config/server-config')(process.env.NODE_ENV);

const app = express();
const { port, mode } = serverConfig;

app.use('/api', adminRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port} with mode ${mode}`);
});
