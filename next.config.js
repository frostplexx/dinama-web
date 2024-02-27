const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, "src/styles")],
        prependData: `@import "variables.scss";`,
    },
    webpack(config) {
        config.resolve.fallback = {

            // if you miss it, all the other options in fallback, specified
            // by next.js will be dropped.
            ...config.resolve.fallback,

            fs: false, // the solution
        };

        return config;
    },
};

module.exports = nextConfig;
