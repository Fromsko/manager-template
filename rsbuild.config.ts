import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';

export default defineConfig({
    plugins: [pluginReact()],
    tools: {
        rspack: {
            plugins: [
                TanStackRouterRspack({
                    routesDirectory: './src/routes',
                    generatedRouteTree: './src/routeTree.gen.ts',
                    autoCodeSplitting: true,
                }),
            ],
        },
    },
    resolve: {
        alias: {
            '@': './src',
        },
    },
    output: {
        assetPrefix: './',
        distPath: {
            root: 'dist',
        },
    },
    performance: {
        chunkSplit: {
            strategy: 'custom',
            splitChunks: {
                cacheGroups: {
                    'vendor-react': {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        name: 'vendor-react',
                        chunks: 'all',
                        priority: 30,
                    },
                    'vendor-antd': {
                        test: /[\\/]node_modules[\\/](antd|@ant-design|rc-.*)[\\/]/,
                        name: 'vendor-antd',
                        chunks: 'all',
                        priority: 20,
                    },
                    'vendor-tanstack': {
                        test: /[\\/]node_modules[\\/](@tanstack)[\\/]/,
                        name: 'vendor-tanstack',
                        chunks: 'all',
                        priority: 15,
                    },
                    'vendor-motion': {
                        test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
                        name: 'vendor-motion',
                        chunks: 'all',
                        priority: 10,
                    },
                },
            },
        },
    },
    server: {
        historyApiFallback: true,
    },
    html: {
        title: 'Gateway Manager',
        favicon: './public/favicon.svg',
    },
});
