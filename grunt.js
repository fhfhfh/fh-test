/**
 * @fileOverview The Grunt config file, where we define all configuration and
 * custom tasks for the Grunt build tool used to automate building, clean-up,
 * client-side tests etc.
 */

module.exports = function(grunt) {
  grunt.initConfig({

    // Config for the LESS to CSS conversions.
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

    // Config for the RequireJS AMD build tool.
    requirejs: {
      ios: {
        options: {
          baseUrl: "builds/ios/www/app/",
          mainConfigFile: 'builds/ios/www/app/app.js',
          name: "main",
          out: "builds/ios/www/app/app.js",
          preserveLicenseComments: false
        }
      }
    },

    // Config for post-build file-removal (LESS, JS etc. files which are no
    // longer needed once concatenation has been done). Should be done for any
    // mobile platform builds, to keep binary size as small as possible.
    clean: {
      ios: [
          'builds/ios/www/app/routers',
          'builds/ios/www/app/text.js',
          'builds/ios/www/app/lib',
          'builds/ios/www/app/templates',
          'builds/ios/www/app/views',
          'builds/ios/www/app/models',
          'builds/ios/www/app/collections',
          'builds/ios/www/less'
      ]
    },

    // Config for live-compilation of LESS to CSS etc. which is very handy to
    // have running in background during development.
    watch: {
      less: {
        files: ['client/default/less/*.less', 'client/default/less/**/*.less'],
        tasks: 'default'
      }
    },

    // Config for our custom 'fhbuild' task, which handles file copying to the
    // decoupled PhoneGap project dirs, taking into account how FH handles
    // 'packages' etc.
    fhbuild: {
      ios: {
        dir: 'builds/ios/www/',
        packages: ['ios']
      }
    },

    // Config for the basic file server which is used in the client-side tests.
    // TODO: Move this config to within test task (outside of normal concern).
    server: {
      base: 'client/default/'
    }
  });

  // These are the external tasks we make use of in our project. Don't forget to
  // include them in the package.json!
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // We use a very specific setup for client-side tests, so in our case Grunt's
  // built in or official support for the Qunit and Jasmine testing frameworks
  // is unsuitable.
  grunt.registerTask('client-tests',
      'Run the client-side Mocha tests through PhantomJS',
      function() {
        var done = this.async();

        var mocha = grunt.util.spawn({
          cmd: 'node',
          args: [
            'node_modules/mocha-phantomjs/bin/mocha-phantomjs',
            '-R',

            // https://github.com/metaskills/mocha-phantomjs for more options.
            'dot',

            'http://localhost:8000/app/tests/'
          ]
        }, function(error, result, code) {
          done(!code);
        });
        mocha.stdout.pipe(process.stdout);
        mocha.stderr.pipe(process.stderr);
      });

  // Here's our custom decoupled FH platform build task...
  grunt.registerMultiTask('fhbuild',
      'Copy the files to relevant dirs for PhoneGap development',
      function() {
        var self = this;

        // TODO: Look into cleaner alternative to ID method below.

        /**
         * Generates a randomised ID supplement, useful for providing targets on
         * the fly when we need non-conflicting configs for tasks.
         *
         * @return {String} A random ID, e.g. '[54]'
         */
        function getRandomId() {
          return '[' + (Math.floor(Math.random() * 100) + 1) + ']';
        }

        // If no config has been set, the task should exit.
        this.requiresConfig('fhbuild');

        // We always want to include the default package, and we always want it
        // to be the first package included, so subsequent packages files will
        // overwrite those.
        var packages = ['default'].concat(
            grunt.config('fhbuild.' + this.target + '.packages'));

        // Here we setup the config needed for this target in order to clean out
        // the target directory and run the task.
        var cleanConfig = grunt.config('clean') || {};
        var randomisedTarget = this.target + getRandomId();
        cleanConfig[randomisedTarget] = [this.data.dir + '*',
                                         this.data.dir + '.*'];
        grunt.config('clean', cleanConfig);
        grunt.task.run('clean:' + randomisedTarget);

        // For each of the packages we dynamically create the copy config and
        // copy the files over to the appropriate dir.

        var copyConfig = grunt.config('copy') || {};

        packages.forEach(function(packageName) {
          var packageGlob = 'client/' + packageName + '/**';

          grunt.log.write('Processing the \'' + packageName + '\' package: ');

          // If the package dir is empty, an attempt to copy anything from it
          // will cause our script to fail.
          if (grunt.file.expand(packageGlob).length == 0) {
            grunt.log.writeln('empty -> skipping!');
            return;
          }
          grunt.log.writeln('OK!');

          var randomisedName = packageName + '[' +
                               (Math.floor(Math.random() * 100) + 1) + ']';
          copyConfig[randomisedName] = {
            files: {}
          };
          copyConfig[randomisedName].files[self.data.dir] = packageGlob;
          grunt.config('copy', copyConfig);
          grunt.task.run('copy:' + randomisedName);
        });
      });

  grunt.registerTask('default', 'less:development');
  grunt.registerTask('ios', 'fhbuild:ios less:ios requirejs:ios clean:ios');

  // TODO: Look into including server running within client-test task.
  grunt.registerTask('test', 'server client-tests');
};
