module.exports = {
  apps: [
    {
      name: 'desenv_fortetech',
      script: 'server.js',
      watch: false,
      env: {
        NODE_ENV: 'desenv'
      },
      out_file: 'C:/Users/Administrator/Desktop/fortetech_desenv/logs/desenv-out.log',
      error_file: 'C:/Users/Administrator/Desktop/fortetech_desenv/logs/desenv-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}
