module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      development: {
        files: {
          'client/default/css/styles.css': 'client/default/less/styles.less'
        },
        options: {
          compress: false
        }
      },
      production: {
        files: {
          'client/default/css/styles.css': 'client/default/less/styles.less'
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
          mainConfigFile: 'builds/ios/www/app/main.js',
          name: "main",
          out: "builds/ios/www/app/main.js",
          preserveLicenseComments: false
        }
      }
    },
    clean: {
      ios: [
          'builds/ios/www/app/Router.js',
          'builds/ios/www/app/text.js',
          'builds/ios/www/app/lib',
          'builds/ios/www/app/templates',
          'builds/ios/www/less'
      ]
    },
    watch: {
      less: {
        files: ['client/default/less/*.less', 'client/default/less/**/*.less'],
        tasks: 'default'
      }
    },

    // We don't set up any default grunt-contrib-copy or grunt-contrib-clean
    // config, as our own config will handle nicely defining packages and their
    // target directories in a single config file, then setting up the copy
    // config as needed behind the scenes.

    fhbuild: {
      ios: {
        dir: 'builds/ios/www/',
        packages: ['ios']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Even though we're not setting up config for these, we'll be making use of
  // them in our task, so must load them into grunt.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Here's our custom task...
  grunt.registerMultiTask('fhbuild',
      'Clear and copy the files to relevant dirs for PhoneGap development',
      function() {

        /**
         * Generates a randomised ID supplement, useful for providing targets on
         * the fly when we need non-conflicting configs for tasks.
         *
         * @return {String} A random ID, e.g. '[54]'
         */
        function getRandomId() {
          return '[' + (Math.floor(Math.random() * 100) + 1) + ']';
        }

        var self = this;

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
          };
          grunt.log.writeln('OK!');

          var randomisedName = packageName + '[' +
                               (Math.floor(Math.random() * 100) + 1) + ']';
          copyConfig[randomisedName] = {
            files: {}
          }
          copyConfig[randomisedName].files[self.data.dir] = packageGlob;
          grunt.config('copy', copyConfig);
          grunt.task.run('copy:' + randomisedName);
        });
      });

  grunt.registerTask('default', 'less:development');
  grunt.registerTask('ios',
      'less:production fhbuild:ios requirejs:ios clean:ios');
};

