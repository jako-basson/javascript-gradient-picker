const path = require("path");

module.exports = {
	entry: {
        'gradient-picker.min': "./src/js/gradient-picker.js",
        'demo': "./src/demo.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, "dist"),
        library: 'gradientPicker',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },
	module: {
		rules: [
			{
				test: /\.html$/,
				use: ["html-loader"]
			},
			{
				test: /\.(svg|png|jpg|gif)$/,
				use: {
					loader: "file-loader",
					options: {
						name: "[name].[hash].[ext]",
						outputPath: "imgs"
					}
				}
			}
		]
	}
};
