var path = require('path');

module.exports = function(config) {
	config.set({
		frameworks: ['mocha', 'chai-sinon', 'source-map-support'],
		reporters: ['mocha'],

		browsers: ['PhantomJS'],

		files: [
			require.resolve('es5-shim'),
			'test/**/*.js'
		],

		mochaReporter: {
			showDiff: true
		},

		preprocessors: {
			'{src,test}/**/*.js': ['webpack', 'sourcemap']
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
							presets: [
								['es2015', { loose:true }],
								'stage-0',
								'react'
							]
						}
					}
				]
			},
			resolve: {
				modulesDirectories: [__dirname, 'node_modules'],
				alias: {
					src: path.join(__dirname, 'src'),
					'preact-compat': path.join(__dirname, 'src')
				}
			},
			devtool: 'inline-sourcemap'
		},

		webpackMiddleware: {
			noInfo: true
		}
	});
};
