const HtmlWebPackPlugin = require("html-webpack-plugin");
//在线上环境，使样式依赖 JS 执行环境并不是一个好的实践。渲染会被推迟，甚至会出现 FOUC，因此在最终线上环境构建时，最好还是能够将 CSS 放在单独的文件中。抽离css样式，防止将样式打包在js中引起页面样式加载错乱的现象。
// extract-text-webpack-plugin does not work with webpack 4. Use mini-css-extract-plugin instead.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//clean-webpack-plugin的作用：在每次生成dist目录前，先删除本地的dist文件（每次自动删除太麻烦）
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  // mode: 'development',
  entry: {
    'bundle':'./src', //输入文件路径 entry 的默认值是 ./src
   //"moreEntry": './src/moreEntry.js'
  },
  output: {
    path: __dirname + '/dist', //output.path 的默认值是 ./dist　path:对应一个绝对路径，此路径是希望一次性打包的目录
    //修改为hash模式
    filename: '[name].[chunkhash].js'//能指定出口文件中同样的filename名称
  },
  devServer: {
    port: 9000,
    open: true
  },
    module: {
      rules: [
        //第一个rule对所有js文件进行babel转译。ES6+ to ES5
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        //第二个rule是对html文件的一个
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader?modules=true", "sass-loader"]
      },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            // {
            //   loader: 'file-loader',
            //   options: {
            //     name: '[name].[ext]',
            //     outputPath: 'images/'
            //   }
            // },
            {
              // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
              // 如下配置，将小于8192byte的图片转成base64码
                loader: 'url-loader',
                options: {
                  limit:'8192',
                  name:'[name].[ext]?[hash]',
                  useRelativePath: false,
                  outputPath: function(fileName){
                      return 'assets/images/'+fileName
                  }
                }
              },
            {
              loader: 'image-webpack-loader', //压缩图片
              options: {
                bypassOnDebug: true,
              }
            }
          ]
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html",
        minify: {
          collapseWhitespace: true, //把生成的 index.html 文件的内容的没用空格去掉，减少空间
        },
        hash: true, //为了更好的 cache，可以在文件名后加个 hash。
        // excludeChunks: ['moreEntry']
      }),
      // new HtmlWebpackPlugin({
      //   template: './src/moreEntry.html',
      //   filename: './moreEntry.html',
      //   minify: {
      //     collapseWhitespace: true,
      //   },
      //   hash: true,
      //   // 这行是新增的。
      //   chunks: ['moreEntry']
      // }),
      new MiniCssExtractPlugin({
        filename: "[name].[chunkhash:8].css", //根据entry中的名字来命名，是静态的。
        chunkFilename: "[id].css" //chunkFilename是构建应用的时候生成的（用户也可以指定名字）
      })
    ]
  };