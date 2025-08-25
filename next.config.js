/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /app\/projects\/chatbot_v2\/embedding/,
      use: 'ignore-loader',
    });
    return config;
  },
}

module.exports = nextConfig
