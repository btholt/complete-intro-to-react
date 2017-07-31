var path = require('path');

module.exports = function(config) {
	config.set({
		basePath: '..',
		frameworks: ['mocha', 'chai-sinon'],
		reporters: ['mocha'],

		browsers: [process.env.KARMA_BROWSERS || 'PhantomJS'],

		files: [
			'tests/**/*.js'
		],

		preprocessors: {
			'tests/**/*.js': ['webpack'],
			'src/**/*.js': ['webpack'],
			'**/*.js': ['sourcemap']
		},

		client: {
			mocha: {
				timeout: 6000
			}
		},

		webpack: {
			module: {
				loaders: [
					{
						test: /\.jsx?$/,
						exclude: /node_modules/,
						loader: 'babel',
						query: {
							sourceMap: 'inline',
							presets: ['es2015-loose', 'stage-0', 'react'],
							plugins: [
								'transform-class-properties',
								'transform-object-rest-spread',
								['transform-react-jsx', { pragma:'h' }]
							]
						}
					},
					{
						test: /\.css$/,
						loader: 'style!css'
					}
				]
			},
			resolve: {
				modulesDirectories: [
					path.resolve(__dirname, '..'),
					'node_modules'
				],
				alias: {
					src: path.resolve(__dirname, '..', 'src')
				}
			}
		},

		webpackMiddleware: {
			noInfo: true
		}
	});
};
