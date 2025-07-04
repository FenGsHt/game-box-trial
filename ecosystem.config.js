module.exports = {
  apps: [{
    name: 'game_box',
    script: 'npm',
    args: 'start',
    cwd: 'C:\\wwwroot\\game_box',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'C:\\wwwroot\\game_box\\logs\\err.log',
    out_file: 'C:\\wwwroot\\game_box\\logs\\out.log',
    log_file: 'C:\\wwwroot\\game_box\\logs\\combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}; 