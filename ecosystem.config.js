// PM2 Ecosystem Configuration for Production
module.exports = {
  apps: [
    {
      name: 'na-ai-systems-api',
      script: './server/index.js',
      cwd: './',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './server/logs/pm2-error.log',
      out_file: './server/logs/pm2-out.log',
      log_file: './server/logs/pm2-combined.log',
      time: true,
      restart_delay: 3000,
      max_restarts: 10,
      autorestart: true,
    },
  ],
};
