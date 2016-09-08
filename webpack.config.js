var webpack = require('webpack');
var path = require('path');

var port = process.env.WEBPACK_PORT || 8080;
var nodeport = process.env.PORT || 3000;
var host = process.env.HOST || 'localhost';

module.exports = {
	devtool: 'inline-source-map',
	entry: [
	'webpack-dev-server/client?http://' + host + ':' + port,
		'webpack/hot/only-dev-server',
		'bootstrap-loader',
		'./src'
	],
	output: {
		path: path.join(__dirname,'public'),
		filename: 'bundle.js',
	},
	resolve:{
		modulesDirectories: ['node_modules','src'],
		extension: ['','.js','.scss']
	},
	module:{
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			},
			{
				test: /\.html$/,
				loader: 'raw'
			},
			{
				test: /\.scss$/,
				loaders: [
					'style',
					'css',
					'autoprefixer?browsers=last 3 versions',
					'sass?outputStyle=expanded'
				]
			},
			{
				test: /\.(woff2?|ttf|eot|svg)$/,
				loader: 'url?limit=1000'
			},
			{
		        test: /\.(jpe?g|jpg|png|gif|svg)$/i,
		        loaders: [
		            'file?hash=sha512&digest=hex&name=[hash].[ext]',
		            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
		        ]
		    },
			{
				test: /bootstrap-sass\/assets\/javascripts\//,
				loader: 'imports?jQuery=jquery'
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	devServer: {
		hot: true,
		proxy: {
			'**':'http://'+host+':'+nodeport
		}
	}
}