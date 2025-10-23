module.exports = {
  apps: [
    {
      name: 'fortetech_desenv',
      script: 'server.js',
      watch: false,
      env: {
        NODE_ENV: 'desenv'
      }
    }
  ]
};
