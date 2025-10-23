module.exports = {
  apps: [
    {
      name: 'fortetech_producao',
      script: 'server.js',
      watch: false,
      env: {
        NODE_ENV: 'producao'
      }
    }
  ]
};
