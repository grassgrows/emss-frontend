/* eslint-disable */
const path = require('path')
module.exports = {
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                path.resolve(__dirname, './src/styles/*.less'),
            ]
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:7777',
                ws: true,
                pathRewrite: { '^/api': '' },
            },
            '/socket': {
                target: 'ws://localhost:7777',
                ws: true,
                pathRewrite: { '^/socket': '' },
            }
            // 部署服务器
            // '/api': {
            //     target: 'https://emss.warmthdawn.top',
            //     ws: true,
            // }
        }
    },
}
