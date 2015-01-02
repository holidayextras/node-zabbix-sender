module.exports = function(grunt) {

	// Add the grunt-mocha-test tasks.
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscoverage');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.initConfig({
		
		mochaTest : {
			build : {
				src : ['test/unit/**/*.js'],
				options : {
					reporter : 'spec',
					checkLeaks : true,
					ignoreLeaks : false,
					require : 'test/unitSetup.js'
				}
			},
			coverage : {
				src : ['test/unit/**/*.js'],
				options : {
					reporter : 'html-cov',
					captureFile : 'test/coverage.html',
					quiet : true,
					require : 'test/coverageSetup.js'
				}
			}
		},
		jscoverage : {
			build : {
				expand : true,
				cwd : 'lib/',
				src : ['**/*.js'],
				dest : 'lib-cov/',
				ext : '.js'
			}
		},
		clean: ['lib-cov'],
		jshint : {
			build : ['Gruntfile.js', 'js/**/*.js']
		}
	});

	grunt.registerTask('unit', 'mochaTest:build');
	grunt.registerTask('coverage', ['jscoverage', 'mochaTest:coverage', 'clean']);
	grunt.registerTask('default', ['unit', 'jshint', 'coverage']);
};
