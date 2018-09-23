#### webpack4-babel7-react-demo
1. webpack-cli的问题： webpack-cli需要和webpack同时安装才能生效。
2. weback新增mode的配置
```javascript
// 1. 配置在webpack.config.js中
module.exports = {
   mode: 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    }
  };
// 2. 直接配置在package.json中（推荐）
  "scripts": {
    "build": "webpack --mode production", //production模式下，将侧重于模块体积优化和线上部署
    "dev": "webpack --mode development" //development模式下，将侧重于功能调试和优化开发体验
  },
```
3. babel的配置:babel-loader,babel preset env,babel preset react
    1. babel preset env for compiling Javascript ES6 code down to ES5 (please note that babel-preset-es2015 is now deprecated)
    2. babel preset react for compiling JSX and other stuff down to Javascript

`npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev`

```javascript
//.baelrc
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

