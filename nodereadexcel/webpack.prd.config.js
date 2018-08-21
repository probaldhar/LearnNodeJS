var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack')
var path = require('path');
var glob = require('glob');
var postcss = [
    require("autoprefixer")({
        browsers: ['ie>=8','>1% in CN']
    })
    //require('postcss-px2rem')({remUnit: 50})
]
var projectRoot = path.resolve(__dirname, '../')
var CleanWebpackPlugin = require('clean-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
//var CopyWebpackPlugin = require('copy-webpack-plugin');
var getEntries=function (globPath) {
    var entries = {}
    /**
     * 读取src目录,并进行路径裁剪
     */
    glob.sync(globPath).forEach(function (entry) {
        /**
         * path.basename 提取出用 ‘/' 隔开的path的最后一部分，除第一个参数外其余是需要过滤的字符串
         * path.extname 获取文件后缀
         */
        var basename = path.basename(entry, path.extname(entry), 'router.js') // 过滤router.js
        // ***************begin***************
        // 当然， 你也可以加上模块名称, 即输出如下： { module/main: './src/module/index/main.js', module/test: './src/module/test/home.js' }

        // ***************end***************
        entries[basename] = entry
    });

// console.log(entries);
// 获取的主入口如下： { main: './src/module/index/main.js', test: './src/module/test/home.js' }
    return entries;
}

var productionConfig = [{
    entry: getEntries('./src/js/page/*.js'),
    output: {
        filename: 'js/page/[name].min.js?v=[chunkhash:5]',
        path: path.resolve(__dirname, './public'),
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'url-loader?limit=2048&context=client&name=[name].[ext]?v=[hash:7]&publicPath=../&outputPath=images/' // Or `url-loader`.
            } ,
            {
                // I want to uglify with mangling only app files, not thirdparty libs
                test: /.*\/(common|base)\/.*\.js$/,
                //include: /(base|common)/, // excluding .spec files
                loader: "uglify-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'improved-image-webpack-loader',
                query: {
                    gifsicle: {
                        interlaced: true,
                        optimizationLevel: 3,
                        number: 256

                    },
                    mozjpeg: {
                        quality: 70,
                        progressive: true
                    },
                    optipng: {
                        optimizationLevel: 7
                    }
                    ,
                    pngquent: {
                        quality: '70',
                        speed: 4
                    }
                }
            },
            {
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract(
                    'style-loader',
                    'css-loader?-autoprefixer!sass-loader?outputStyle=expanded')
                //    {
                //
                //    loaders: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap',
                //        {
                //            loader: 'postcss-loader',
                //            options: {
                //                config: {
                //                    path: 'postcss.config.js'
                //                }
                //            }
                //        }]
                //})
        },

            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: projectRoot,
                exclude: /node_modules/
            }]
    },
    postcss: postcss,
    plugins: [
        //new CleanWebpackPlugin(['public/js/page']),
        //new CleanWebpackPlugin(['public/css']),
        new ExtractTextPlugin('css/[name].css?v=[chunkhash:5]'),

        //new ExtractTextPlugin({
        //    filename: 'css/[name].css?v=[chunkhash:5]',
        //    allChunks: true
        //}),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            mangle: {
                screw_ie8: false
            }
        }),



        new webpack.optimize.OccurrenceOrderPlugin(),

        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        })
    ]
}];

module.exports = productionConfig;
