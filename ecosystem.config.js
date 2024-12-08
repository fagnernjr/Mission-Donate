module.exports = {
  apps: [
    {
      name: 'mission-donate',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001,
      },
    },
    {
      name: 'mission-donate-worker',
      script: './workers/index.js',
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
    },
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: ['host1', 'host2'],
      ref: 'origin/main',
      repo: 'git@github.com:username/mission-donate.git',
      path: '/var/www/mission-donate',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
    staging: {
      user: 'ubuntu',
      host: 'staging-host',
      ref: 'origin/develop',
      repo: 'git@github.com:username/mission-donate.git',
      path: '/var/www/mission-donate-staging',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
}
