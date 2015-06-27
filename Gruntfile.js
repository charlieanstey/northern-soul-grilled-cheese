'use strict';

module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// JSHint gets sad about grunt-aws-s3
	grunt.task.renameTask('aws_s3', 's3Deploy');

	// Configurable paths for the application
	var appConfig = {
		app: require('./bower.json').appPath || 'app',
		dist: 'dist'
	};

	grunt.initConfig({
		watch: {
			// bower: {
			// 	files: ['bower.json'],
			// 	tasks: ['wiredep']
			// },
			js: {
				files: ['app/scripts/{,*/}*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			jsTest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: ['newer:jshint:test', 'karma'] //TODO: Replace karma with mocha
			},
			scripts: {
				files: ['app/styles/{,*/}*.{scss,sass}'],
				tasks: ['sass:server', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'app/{,*/}*.html',
					'.tmp/styles/{,*/}*.css',
					'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/styles/',
					src: '{,*/}*.css',
					dest: '.tmp/styles/'
				}]
			}
		},

		// Automatically inject Bower components into the app
		// wiredep: {
		// 	app: {
		// 		src: ['app/index.html'],
		// 		ignorePath: /\.\.\//
		// 	},
		// 	sass: {
		// 		src: ['app/styles/{,*/}*.{scss,sass}'],
		// 		ignorePath: /(\.\.\/){1,2}bower_components\//
		// 	}
		// },

		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					middleware: function(connect) {
						return [
							connect.static('.tmp'), //TODO: confirm needs to be a separate copy of site built for livereload
							connect().use(
								'/bower_components',
								connect.static('./bower_components')
							),
							connect.static(appConfig.app)
						];
					}
				}
			},
			test: {
				options: {
					port: 9001,
					middleware: function(connect) {
						return [
							connect.static('.tmp'),
							connect.static('test'),
							connect().use(
								'/bower_components',
								connect.static('./bower_components')
							),
							connect.static(appConfig.app)
						];
					}
				}
			},
			dist: {
				options: {
					open: true,
					base: 'dist'
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'app/scripts/{,*/}*.js'
				]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/spec/{,*/}*.js']
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'dist/{,*/}*',
						'!dist/.git{,*/}*'
					]
				}]
			},
			server: '.tmp'
		},

		// Compiles Sass to CSS and generates necessary files if requested
		sass: {
			options: {
				loadPath: ['bower_components']
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'app/styles',
					src: ['*.scss'],
					dest: '.tmp/styles',
					ext: '.css'
				}]
			},
			server: {
				options: {
					debugInfo: true
				},
				files: [{
					expand: true,
					cwd: 'app/styles',
					src: ['*.scss'],
					dest: '.tmp/styles',
					ext: '.css'
				}]
			}
		},

		// Renames files for browser caching purposes
		filerev: {
			dist: {
				src: [
					'dist/scripts/{,*/}*.js',
					'dist/styles/{,*/}*.css',
					'dist/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
					'dist/styles/fonts/*'
				]
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: 'app/index.html',
			options: {
				dest: 'dist',
				flow: {
					html: {
						steps: {
							js: ['concat', 'uglifyjs'],
							css: ['cssmin']
						},
						post: {}
					}
				}
			}
		},

		// Performs rewrites based on filerev and the useminPrepare configuration
		usemin: {
			html: ['dist/{,*/}*.html'],
			css: ['dist/styles/{,*/}*.css'],
			options: {
				assetsDirs: ['dist', 'dist/images']
			}
		},

		// The following *-min tasks will produce minified files in the dist folder
		// By default, your `index.html`'s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.
		// cssmin: {
		//   dist: {
		//     files: {
		//       'dist/styles/main.css': [
		//         '.tmp/styles/{,*/}*.css'
		//       ]
		//     }
		//   }
		// },
		// uglify: {
		//   dist: {
		//     files: {
		//       'dist/scripts/scripts.js': [
		//         'dist/scripts/scripts.js'
		//       ]
		//     }
		//   }
		// },
		// concat: {
		//   dist: {}
		// },

		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [{
					expand: true,
					cwd: 'dist',
					src: ['*.html', 'views/{,*/}*.html'],
					dest: 'dist'
				}]
			}
		},

		// Replace Google CDN references
		cdnify: {
			dist: {
				html: ['dist/*.html']
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'app',
					dest: 'dist',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'views/{,*/}*.html',
						'images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
						'fonts/{,*/}*.*'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: 'dist/images',
					src: ['generated/*']
				}]
			},
			serve: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'app',
					dest: '.tmp',
					src: ['fonts/{,*/}*.*']
				}]
			},
			styles: {
				expand: true,
				cwd: 'app/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

		robotstxt: {
			dist: {
				dest: 'dist/',
				policy: [{
					ua: '*',
					allow: '/'
				}]
			},
			staging: {
				dest: 'dist/',
				policy: [{
					ua: '*',
					disallow: '/'
				}]
			}
		},

		aws: grunt.file.readJSON('aws-key.json'), // Read the file

		s3Deploy: {
			options: {
				accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
				secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
				region: 'eu-west-1',
				uploadConcurrency: 5, // 5 simultaneous uploads
				downloadConcurrency: 5 // 5 simultaneous downloads
			},
			staging: {
				options: {
					bucket: 'northernsoul.charlieanstey.com'
				},
				files: [{
					action: 'delete',
					dest: '/'
				}, {
					expand: true,
					cwd: 'dist/',
					src: ['**'],
				}]
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'sass:server'
			],
			test: [
				'sass'
			],
			dist: [
				'sass:dist'
			]
		}
	});

	grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			// 'wiredep',
			'concurrent:server',
			'autoprefixer',
			'copy:serve',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('test', [
		'clean:server',
		'concurrent:test',
		'autoprefixer',
		'connect:test' //TODO: Add test runner
	]);

	grunt.registerTask('build', [
		'clean:dist',
		// 'wiredep',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'copy:dist',
		'cdnify',
		'cssmin',
		'filerev',
		'usemin',
		'htmlmin'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'test',
		'build',
		'robotstxt:staging',
		's3Deploy:staging'
	]);
};
