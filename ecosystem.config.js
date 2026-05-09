module.exports = {
  apps: [
    {
      name: "eros-enterprises",
      script: ".next-production-build/standalone/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: 3000,
      },
    },
  ],
};
