module.exports = { reactStrictMode: true };

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            crypto: false,
        };
        return config;
    },
    transpilePackages: ['@coral-xyz/anchor'],
};

module.exports = nextConfig;