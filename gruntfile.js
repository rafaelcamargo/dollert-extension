module.exports = function(grunt) {

  var pathLibs = 'node_modules/';
  var pathSrc = 'src/';
  var pathDist = 'dist/';
  var pathSpec = 'spec/';
  var pathImages = pathSrc + 'img/';
  var pathScripts = pathSrc + 'js/';
  var pathStyles = pathSrc + 'styl/';
  var pathTemplates = pathSrc + 'jade/';
  var pathLocales = pathTemplates + 'locales/';
  var pathMonitoring = pathScripts + 'monitoring/';
  var libFiles = pathLibs + '**/*.min.js';
  var styleFiles = pathStyles + '**/*.styl';
  var scriptFiles = pathScripts + 'dollert.js';
  var templateFiles = pathTemplates + '**/*.jade';
  var imageFiles = pathImages + '**/*';
  var specFiles = pathSpec + '**/*-spec.js';
  var manifestFile = pathSrc + 'manifest.json';
  var configFiles = [
    'package.json',
    'gruntfile.js',
    'karma.conf.js'
  ];

  grunt.initConfig({

    stylus: {
      compile: {
        files: {
          'dist/dollert.min.css': styleFiles
        }
      }
    },

    cssmin: {
      target: {
        files: {
          'dist/dollert.min.css': pathDist + 'dollert.min.css'
        }
      }
    },

    copy :{
      images: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: pathImages,
            src: '*.*',
            dest: pathDist
          }
        ],
      },
      manifest: {
        files: [
          {
            expand: true,
            flatten: true,
            src: manifestFile,
            dest: pathDist
          }
        ],
      }
    },

    jade: {
      pages: {
        files: {
          'dist/popup.html': pathTemplates + 'popup.jade'
        }
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      dollert: {
        files : {
          'dist/dollert.min.js': pathDist + 'dollert.min.js'
        }
      }
    },

    concat_in_order: {
      dist : {
        files : {
          'dist/dollert.min.js': [
            pathLibs + 'jquery/dist/jquery.min.js',
            scriptFiles
          ]
        }
      }
    },

    jshint: {
      conf: configFiles,
      dist: scriptFiles
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    watch: {
      styles: {
        files: styleFiles,
        tasks: ['stylus']
      },
      dist: {
        files: scriptFiles,
        tasks: [
          'jshint:dist',
          'concat_in_order:dist'
        ]
      },
      templates: {
        files: templateFiles,
        tasks: ['jade']
      },
      spec: {
        files: specFiles,
        tasks: ['karma']
      },
      conf: {
        files: configFiles,
        tasks: ['jshint:conf']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-concat-in-order');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', [
    'stylus',
    'copy',
    'concat_in_order',
    'jshint',
    'jade',
    'karma'
  ]);

  grunt.registerTask('start', [
    'build',
    'watch'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'uglify'
  ]);

};