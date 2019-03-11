const { join } = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { findComponentEntryPoints, findComponentStyles } = require('../libs/finder');
const { getAliasFromTsConfig } = require('../libs/alias');

async function getConfiguration(appSettings) {
    const entriesPromise = findComponentEntryPoints(appSettings);
    const stylesPromise = findComponentStyles(appSettings);
    const [entries, styles] = await Promise.all([entriesPromise, stylesPromise]);
    const alias = getAliasFromTsConfig(appSettings);

    return {
        context: appSettings.context,
        mode: 'development',
        devtool: 'inline-source-map',

        stats: {
            colors: true,
            chunks: false,
            chunkModules: false,
            chunkOrigins: false,
            modules: false,
            entrypoints: false
        },

        entry: {
            'vendor': join(appSettings.context, appSettings.paths.project.shopUiStoreModule, './vendor.ts'),
            'app': [
                join(appSettings.context, appSettings.paths.project.shopUiStoreModule, './app.ts'),
                join(appSettings.context, appSettings.paths.project.shopUiStoreModule, './styles/basic.scss'),
                ...entries,
                join(appSettings.context, appSettings.paths.project.shopUiStoreModule, './styles/util.scss')
            ]
        },

        output: {
            path: join(appSettings.context, appSettings.paths.public),
            publicPath: `${appSettings.urls.assets}/`,
            filename: `./js/[name].js`,
            jsonpFunction: `webpackJsonp_${appSettings.name.replace(/(-|\W)+/gi, '_')}`
        },

        resolve: {
            extensions: ['.ts', '.js', '.json', '.css', '.scss'],
            alias
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: {
                        context: appSettings.context,
                        configFile: join(appSettings.context, appSettings.paths.tsConfig),
                        compilerOptions: {
                            baseUrl: appSettings.context,
                            outDir: appSettings.paths.public
                        }
                    }
                },
                {
                    test: /\.scss/i,
                    use: [
                        MiniCssExtractPlugin.loader, {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    autoprefixer({
                                        'browsers': ['> 1%', 'last 2 versions']
                                    })
                                ]
                            }
                        }, {
                            loader: 'sass-loader'
                        }, {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [
                                    join(appSettings.context, appSettings.paths.project.shopUiStoreModule, './styles/shared.scss'),
                                    ...styles
                                ]
                            }
                        }
                    ]
                }
            ]
        },

        optimization: {
            runtimeChunk: 'single',
            concatenateModules: false,
            splitChunks: {
                chunks: 'initial',
                minChunks: 1,
                cacheGroups: {
                    default: false,
                    vendors: false
                }
            }
        },

        plugins: [
            new webpack.DefinePlugin({
                __NAME__: `'${appSettings.name}'`,
                __PRODUCTION__: false
            }),

            new CleanWebpackPlugin([
                'js',
                'css',
                'images',
                'fonts'
            ], {
                root: join(appSettings.context, appSettings.paths.public),
                verbose: true,
                beforeEmit: true
            }),

            new CopyWebpackPlugin([
                {
                    from: `${appSettings.paths.assets}/images`,
                    to: 'images',
                    ignore: ['*.gitkeep']
                }, {
                    from: `${appSettings.paths.assets}/fonts`,
                    to: 'fonts',
                    ignore: ['*.gitkeep']
                }
            ], {
                context: appSettings.context
            }),

            new MiniCssExtractPlugin({
                filename: `./css/[name].css`,
            })
        ]
    }
}

module.exports = getConfiguration;
