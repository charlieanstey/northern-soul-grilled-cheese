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
		assets: 'assets',
		theme: 'wp-content/themes/northernsoul'
	};

	grunt.initConfig({
		watch: {
			js: {
				files: ['assets/scripts/{,*/}*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			jsTest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: ['newer:jshint:test', 'karma'] //TODO: Replace karma with mocha
			},
			sass: {
				files: ['assets/sass/{,*/}*.{scss,sass}'],
				tasks: ['sass:dist', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					appConfig.theme + '/{,*/}*.php',
					'assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
					cwd: appConfig.theme + '/css/',
					src: '{,*/}*.css',
					dest: appConfig.theme + '/css/'
				}]
			}
		},

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
							connect.static(appConfig.theme)
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
							connect.static(appConfig.theme)
						];
					}
				}
			},
			dist: {
				options: {
					open: true,
					base: appConfig.theme
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
					appConfig.assets + '/scripts/{,*/}*.js'
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
						appConfig.theme + '/css/{,*/}*',
						appConfig.theme + '/fonts/{,*/}*',
						appConfig.theme + '/images/{,*/}*',
						'.tmp'
					]
				}]
			}
		},

		// Compiles Sass to CSS and generates necessary files if requested
		sass: {
			options: {
				loadPath: ['bower_components']
			},
			dist: {
				files: [{
					expand: true,
					cwd: appConfig.assets + '/sass',
					src: ['*.scss'],
					dest: appConfig.theme + '/css',
					ext: '.css'
				}]
			}
		},

		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: false,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: false
				},
				files: [{
					expand: true,
					cwd: appConfig.theme,
					src: ['/{,*/}*.php'],
					dest: appConfig.theme
				}]
			}
		},

		// Replace Google CDN references
		cdnify: {
			dist: {
				html: [appConfig.theme + '/{,*/}*.php']
			}
		},

		cssmin: {
			options: {
				//relativeTo: appConfig.theme,
				//root: '../'
			},
			minify: {
				files: [{
					expand: true,
					cwd: appConfig.theme + '/css',
					src: ['*.css', '!*.min.css'],
					dest: appConfig.theme + '/css',
					ext: '.min.css'
				}]
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: appConfig.assets,
					dest: appConfig.theme,
					src: [
						'*.{ico,png,txt}',
						'images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
						'fonts/{,*/}*.*'
					]
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
				dest: '',
				policy: [{
					ua: '*',
					allow: '/'
				}]
			},
			staging: {
				dest: '',
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
			test: [
				'sass'
			],
			dist: [
				'sass'
			]
		}
	});

	grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean',
			'concurrent:server',
			'autoprefixer',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('test', [
		'clean',
		'concurrent:test',
		'autoprefixer',
		'connect:test' //TODO: Add test runner
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'concurrent:dist',
		'autoprefixer',
		'copy:dist',
		'cdnify',
		'cssmin',
		'htmlmin'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'test',
		'build'
		//'robotstxt:staging',
		//'s3Deploy:staging'
	]);
};
