var CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin;
var DefinePlugin = require('webpack').DefinePlugin;

var ExtractCssPlugin = require('./lib/extract-css-webpack-plugin');
var path = require("path");

module.exports = {
	entry: {
		 A: "./a",
		 B: "./b",
		 C: "./c",
	},
	output: {
		path: path.join(__dirname, "js"),
		filename: "[name].js",
        chunkFilename: "[id].bundle.js"
	},
	module: {
        noParse: /\.css$/
	},
	plugins: [
		new CommonsChunkPlugin({
			name: "commons",
			filename: "commons.js",
			chunks: ["A", "B"]
		}),
		new ExtractCssPlugin(),
	]
};
