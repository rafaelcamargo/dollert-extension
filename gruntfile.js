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
  var scriptFiles = pathScripts + '**/*.js';
  var templateFiles = pathTemplates + '**/*.jade';
  var imageFiles = pathImages + '**/*';
  var specFiles = pathSpec + '**/*-spec.js';
  var manifestFile = pathSrc + 'manifest.json';
  var distFiles = pathDist + '**/*.*';
  var configFiles = [
    'package.json',
    'gruntfile.js',
    'karma.conf.js'
  ];

  grunt.initConfig({

    stylus: {
      compile: {
        files: {
          'dist/popup.min.css': styleFiles
        }
      }
    },

    cssmin: {
      target: {
        files: {
          'dist/popup.min.css': pathDist + 'popup.min.css'
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
          'dist/popup.min.js': pathDist + 'popup.min.js',
          'dist/notifier.min.js': pathDist + 'notifier.min.js'
        }
      }
    },

    concat_in_order: {
      dist : {
        files : {
          'dist/popup.min.js': [
            pathLibs + 'jquery/dist/jquery.min.js',
            pathScripts + 'chrome-service.js',
            pathScripts + 'popup.js'
          ],
          'dist/notifier.min.js': [
            pathLibs + 'jquery/dist/jquery.min.js',
            pathScripts + 'chrome-service.js',
            pathScripts + 'notifier-service.js'
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
        tasks: ['stylus','cssmin']
      },
      dist: {
        files: scriptFiles,
        tasks: [
          'jshint:dist',
          'concat_in_order:dist'
        ]
      },
      images: {
        files: imageFiles,
        tasks: ['copy:images']        
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
      },
      manifest: {
        files: manifestFile,
        tasks: ['copy:manifest']
      }
    },

    exec: {
      clearDist: 'rm -rf ./dist'
    },

    zip: {
      './dist.zip': distFiles
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
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-zip');

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
    'exec:clearDist',
    'build',
    'cssmin',
    'uglify',
    'zip'
  ]);

};