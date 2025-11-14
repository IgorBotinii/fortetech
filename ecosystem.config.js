module.exports = {
  apps: [
    {
      name: "fortetech_desenv",
      script: "server.js",
      watch: false,
      env: {
        NODE_ENV: "desenv"
      },
      out_file: "NUL",
      error_file: "NUL",
      log_file: "NUL"
    }
  ]
}
