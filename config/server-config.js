const serverConfig = {
  local: {
    mode: 'local',
    port: 3000,
  },
  production: {
    mode: 'production',
    port: 5000,
  },
};

module.exports = mode =>
  serverConfig[mode || process.argv[2] || 'local'] || serverConfig.local;
