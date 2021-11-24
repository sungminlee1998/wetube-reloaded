const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
entry: './src/client/js/main.js',
mode:'development',
watch: true,
//variable 바꾸면 알아서 적용됨
clean: true,
//clean the output folder before we start the new build
plugins: [new MiniCssExtractPlugin({
  filename: "css/styles.css",
  //make a css folder to seperate with js folder
})],
 output: {
     filename: "js/main.js",
     path: path.resolve(__dirname, "assets")
     //  = C:\Users\이성민\Desktop\myyoutube\assets\js
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
              ]
            }
          }
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', "sass-loader"]
          //webpack starts from backward
          //scss -> css, interpret @import and url(), and then put into DOM(website) 
          // Mini~ will create a seperate css file to handle, instead of handleing everything in the main.js file
        }
     ]
  }
}