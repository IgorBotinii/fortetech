module.exports = {
  apps: [
    {
      name: "fortetech_desenv",
      script: "server.js",
      watch: false,
      env: {
        NODE_ENV: "desenv"
      },
      out_file: "C:/Users/Administrator/pm2_desenv/out.log",
      error_file: "C:/Users/Administrator/pm2_desenv/error.log",
      log_file: "C:/Users/Administrator/pm2_desenv/log.log"
    }
  ]
};
