const webpack = require("webpack");
const path    = require("path");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");

const production = process.env.ENVIRONMENT === "production";

module.exports = {
    devtool : production ? "none" : "sourcemap",
    entry   : path.resolve(__dirname, "src", "index.js"),
    mode    : "development",
    resolve : { extensions: [".js", ".jsx"] },
    module  : {
        rules : [
            {
                test    : /\.js$/,
                exclude : /node_modules/,
                use     : [{
                    loader: "babel-loader",
                    options : { plugins : ["react-hot-loader/babel"] }
                }]
            }
        ]
    },
    output : {
        path       : path.resolve(__dirname, "public"),
        publicPath : "/",
        filename   : production ? "[hash].min.js" : "bundle.min.js"
    },
    devServer: {
        publicPath         : "/",
        contentBase        : "public",
        port               : 8080,
        historyApiFallback : { index: "index.html" },
        proxy              : { "/api": "http://localhost:8000" },
        overlay            : true
    },
    plugins : [
        new WebpackBuildNotifierPlugin({
          title       : "React : Build succeeded!",
          successIcon : path.resolve(__dirname, "react.png")
        })
    ],
};