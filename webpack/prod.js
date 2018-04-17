'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

process.traceDeprecation = true;

const config = env => ({
    name: 'client',
    context: path.resolve(__dirname, './'),
    stats: 'verbose', // errors-only
    bail: true,
    cache: false,
    entry: {
        'js/base.js': [
            'babel-regenerator-runtime',
            'js/base.js'
        ],
        'css/style.css': 'css/style.css',
        'js/deps.js': 'js/deps.js',
        'static-images': 'static-images.js' // build all images not referenced in css
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        publicPath: '//localhost:9011/',
        filename: '[name]'
    },

    module: {
        rules: [
        // Babel loader
            {
                test: /\.(js)?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015'],
                            plugins: [
                                'transform-async-to-generator',
                                'transform-object-assign'
                            ]//.map(require.resolve)
                        }
                    }
                ]
            },

      // Post-css loader setup, to be able to bundle all the code for the components together
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader?modules&importLoaders=1&localIdentName=[local]!postcss-loader'
                        },
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                })
            },

      // Inline fonts
            {
                test: /\.(woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            },

            {
                test: /\.inline\.(gif|png|jpg|svg)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    context: 'client',
                    name: '[name].[ext]'
                }
            },

            {
                test: /^[^.]+\.(gif|png|jpg|svg|ico|xml)?$/,
                loader: 'file-loader', // url-loader to inline
                query: {
                    limit: 10000,
                    context: 'client',
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                    // scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
                    // sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
                    }
                }
            }
        ]
    },

    resolve: {
        modules: ['client', 'node_modules'],
        extensions: ['.js', '.json', '.css']
    },

    plugins: [
    // Plugin for writing css bundle loaded in components
        new ExtractTextPlugin({
            filename: '[name]',
            disable: false,
            allChunks: true
        }),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                APP_ENV: JSON.stringify('browser')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            output: {
                comments: false
            },
            mangle: {
                except: ['ilmrL0ad']
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new WebpackNotifierPlugin(),
        new webpack.ProvidePlugin({
            Promise: 'es6-promise'
        })
    ]
});

module.exports = config;

