module.exports = function(grunt) {

  grunt.initConfig({

    clean: {
      pre: {
        src: ['builds/ios/www/']
      },
      post: {
        src: [
          'builds/ios/www/app/**/!(app|require).js',
          'builds/ios/www/app/!(lib)/',
          'builds/ios/www/styles/!(styles.css)'
        ]
      }
    },

    copy: {
      ios: {
        files: [
          {
            expand: true,
            cwd: 'client/default/',
            src: ['**'],
            dest: 'builds/ios/www/'
          },
          {
            expand: true,
            cwd: 'client/ios/',
            src: ['**'],
            dest: 'builds/ios/www/'
          }
        ]
      }
    },

    less: {
      dev: {
        files: {
          'client/default/css/styles.css': 'client/default/less/styles.less'
        },
        options: {
          compress: false
        }
      },
      ios: {
        files: {
          'builds/ios/www/css/styles.css': 'builds/ios/www/less/styles.less'
        },
        options: {
          compress: true
        }
      }
    },

    requirejs: {
      ios: {
        options: {
          baseUrl: "builds/ios/www/app/",
          mainConfigFile: 'builds/ios/www/app/app.js',
          name: "app",
          out: "builds/ios/www/app/app.js",
          preserveLicenseComments: false
        }
      }
    },

    fhinit: {
      ios: {
        file: 'builds/ios/www/app/app.js',
        config: {
          host: 'https://securehealthhub.feedhenry.com',
          appid: '2MZDpXsUThCoLHsCb4-UoNNH',
          appkey: '4c81bba36a10bcf9bd7a47a8cad91b94be3679a5',
          mode: 'dev'
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');


  grunt.registerMultiTask('fhinit',
      'Replace $fh.init params with proper config',
      function() {
        var regex = /(\$fh\.init\()\{[\s\S]*?\}/,
            initConfig, file, contents;

        this.requiresConfig('fhinit');

        initConfig = JSON.stringify(grunt.config('fhinit.' + this.target +
            '.config'));

        file = grunt.config('fhinit.' + this.target + '.file');
        contents = grunt.file.read(file);
        contents = contents.replace(regex, '$1' + initConfig);

        grunt.file.write(file, contents);
      });


  grunt.registerTask('test', 'Run client-side tests', function(runner) {
    var done = this.async();
    runner = runner || 'spec';

    var fhc = grunt.util.spawn({
      cmd: 'fhc',
      args: [
          'local',
          'singlePage=false'
      ]
    }, function(error, result, code) {
      // TODO: Implement quit on error.
    });
    fhc.stderr.pipe(process.stderr);

    var mocha = grunt.util.spawn({
      cmd: 'node',
      args: [
        'node_modules/mocha-phantomjs/bin/mocha-phantomjs',
        '-R',
        runner,
        'http://localhost:8888/app/test/'
      ]
    }, function(error, result, code) {
      fhc.kill();
      done(!code);
    });
    mocha.stdout.pipe(process.stdout);
    mocha.stderr.pipe(process.stderr);
  });


  grunt.registerTask('ios', [
    'clean:pre',
    'copy:ios',
    'less:ios',
    'fhinit:ios',
    'requirejs:ios',
    'clean:post'
  ]);
};
