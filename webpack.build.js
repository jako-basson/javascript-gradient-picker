
const common = require("./webpack.common");
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
	mode: "production",
	optimization: {
		minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()]
	},
	plugins: [
		new MiniCssExtractPlugin({ filename: "[name].css" }),
		new CleanWebpackPlugin(),
		new HtmlWebPackPlugin({
			template: "./src/template.html",
			minify: {
				removeAttributeQuotes: false,
				collapseWhitespace: false,
				removeComments: false
			}
		})
	],
	module: {
		rules: [
			{
				test: /\.scss|.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]
					}
				}
			}
		]
	}
});
