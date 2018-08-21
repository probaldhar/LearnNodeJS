
var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
//var es3ifyPlugin = require('es3ify-webpack-plugin');

var projectRoot = path.resolve(__dirname, '../');
var getEntries=function (globPath) {
    var entries = {};
    /**
     * 读取src目录,并进行路径裁剪
     */
    glob.sync(globPath).forEach(function (entry) {
        /**
         * path.basename 提取出用 ‘/' 隔开的path的最后一部分，除第一个参数外其余是需要过滤的字符串
         * path.extname 获取文件后缀
         */
        var basename = path.basename(entry, path.extname(entry), '_') // 过滤router.js
        // ***************begin***************
        // 当然， 你也可以加上模块名称, 即输出如下： { module/main: './src/module/index/main.js', module/test: './src/module/test/home.js' }
        // 最终编译输出的文件也在module目录下， 访问路径需要时 localhost:8080/module/index.html

        // ***************end***************
        //entries[basename] = ['./dev-client'].concat(entry);
        entries[basename] = ['./dev-client'].concat(entry);
    });
// console.log(entries);
// 获取的主入口如下： { main: './src/module/index/main.js', test: './src/module/test/home.js' }
    return entries;
};

var devConfig = {
    entry: getEntries('./src/js/page/*.js'),
    output: {
        filename: './js/page/[name].min.js?v=[hash:5]',
        path: path.resolve(__dirname, './public'),
        publicPath: "/project/shstp"
    },
    devtool: 'eval-source-map',
    module: {
        //postLoaders: [
        //    {
        //        test: /\.js$/,
        //        loaders: ['es3ify-loader']
        //    }
        //],
        loaders: [
            {
            test: /\.(scss|css)$/,
            loaders: [
                'style-loader',
                'css-loader?sourceMap',
                'resolve-url-loader',
                'sass-loader?sourceMap'
            ]
        },
            {
                test: /\.js$/,
                loader: 'babel-loader',

                include: projectRoot,

                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader:'url?limit=2048&context=client&name=[name].[ext]?v=[hash:7]&publicPath=http://gcboxdev.cnsuning.com:3000/project/shstp/&outputPath=images/'
            }
            //{
            //    test: /\.(jpe?g|png|gif|svg)$/i,
            //    loader: [
            //        {
            //            loader: 'url-loader?limit=2048&context=client&name=[name].[ext]?v=[hash:7]&publicPath=../project/gcboxfe&outputPath=images/' // Or `url-loader`.
            //
            //        }
            //
            //    ]
            //}

        ]

    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoEmitOnErrorsPlugin()
        new webpack.NoErrorsPlugin(),
        //new es3ifyPlugin()


    ]
};


module.exports = devConfig;
