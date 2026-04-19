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
                    autoCodeSplitting: false,
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
    server: {
        historyApiFallback: true,
    },
    html: {
        title: 'Gateway Manager',
        favicon: './public/favicon.svg',
    },
});
