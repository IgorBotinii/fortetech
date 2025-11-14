module.exports = {
  apps: [
    {
      name: 'desenv_fortetech',
      script: 'server.js',
      watch: false,
      env: {
        NODE_ENV: 'desenv'
      }
    }
  ]
};
