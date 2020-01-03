module.exports = {
    apps: [
      {
        name: 'depo-api',
        script: './src/index.js',
        instances: 0,
        watch: false,
        env: {
            PORT: 3002,
            NODE_ENV: "development"
        },
        env_development: {
          PORT: 3000,
          NODE_ENV: 'development',
          UPLOAD_DIR: '/home/ubuntu/uploads'
        },
        env_production: {
          PORT: 3001,
          NODE_ENV: 'production'
        }
      }
    ]
  };