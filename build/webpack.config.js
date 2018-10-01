const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const src = path.join(__dirname, '../src');

const isDevelopment = process.env.NODE_ENV !== 'production';

const canMinify = () =>
    !isDevelopment && {
        html5: true,
        collapseWhitespace: true,
        caseSensitive: true,
        removeComments: true,
        removeEmptyElements: true,
    };

/**
 * Manifest is created each time a new component is generated
 */
const components = require('./componentManifest');

/**
 * Pages for testing
 */
const pages = ['index'];

const allItems = {
    pages,
    components,
};

const entry = {};

allItems.pages.map(el => {
    entry[`${el}`] = `./src/scripts/${el}.js`;
});

allItems.components.map(el => {
    // Set the key as the folder where the output will be placed,
    // means the js ends up in the same area
    entry[`components/${el}/${el}`] = `./src/components/${el}/${el}.js`;
});

const generatorDefaults = {
    inject: 'body',
    inlineSource: '.(js|css)$',
    minify: canMinify(),
    showErrors: true,
    title: '',
};

const generateHtmlPages = () => {
    /**
     * As pages are generally only for testing, we don't want to spit them
     * out when we build
     */
    if (isDevelopment) {
        return allItems.pages.map(page => {
            return new HtmlWebpackPlugin({
                filename: './' + page + '.html',
                template: './src/' + page + '.handlebars',
                ...generatorDefaults,
            });
        });
    }
};

const generateHtmlComponents = () => {
    return allItems.components.map(component => {
        const fileName = isDevelopment ? './' : `./c    omponents/${component}`;
        const data = require(`../src/components/${component}/${component}_data.js`);

        return new HtmlWebpackPlugin({
            template: `src/components/${component}/${component}.handlebars`,
            templateParameters: data,
            chunks: [`components/${component}/${component}`],
            filename: `${fileName}/${component}.html`,
            ...generatorDefaults,
        });
    });
};

module.exports = {
    entry: {
        ...entry,
    },
    output: {
        filename: '[name].bundle.js',
    },
    performance: { hints: false },
    resolve: {
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js',
        },
    },
    watch: !isDevelopment,
    devtool: isDevelopment && 'source-map',
    devServer: {
        port: 3000,
        open: true,
        contentBase: src,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCssAssetsPlugin({}),
        ],
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },

            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '/',
                            useRelativePath: true,
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
                            optipng: {
                                enabled: true,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            webp: {
                                quality: 75,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.handlebars$/,
                use: [
                    {
                        loader: 'handlebars-loader',
                        query: {
                            inlineRequires: '/img/',
                            helperDirs: [path.join(src, 'helpers')],
                            partialDirs: [
                                path.join(src, 'partials'),
                                path.join(src, 'components'),
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDevelopment,
                            minimize: !isDevelopment,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            autoprefixer: {
                                browsers: ['last 2 versions'],
                            },
                            sourceMap: true,
                            plugins: () => [autoprefixer],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                handlebarsLoader: {},
            },
        }),
        new MiniCssExtractPlugin({
            filename: '[name]-styles.css',
        }),

        ...generateHtmlPages(),
        ...generateHtmlComponents(),
        new HtmlWebpackInlineSourcePlugin(),
    ],
};
