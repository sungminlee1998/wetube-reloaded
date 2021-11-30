const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
entry: {
  main:  './src/client/js/main.js',
  videoPlayer: './src/client/js/videoPlayer.js'
},
  mode:'development',
watch: true,
//variable 바꾸면 알아서 적용됨
plugins: [
  new MiniCssExtractPlugin({
    filename: "css/styles.css",
    //make a css folder to be seperated from the js folder
  })],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    //  = C:\Users\이성민\Desktop\myyoutube\assets\js
    clean: true,
    //clean the output folder before we start the new build
  },  
 module: {
     rules: [
         {
         test: /\.js$/,
         //take all the js files
         //and then apply the loader below
         use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: "defaults" }]
              ],
            },
          },
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', "sass-loader"]
          //webpack starts from backward
          //scss -> css, interpret @import and url(), and then put into DOM(website) 
          // Mini~ will create a seperate css file to handle, instead of handleing everything in the main.js file
        },
     ],
  },
}