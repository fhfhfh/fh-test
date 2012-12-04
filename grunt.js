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
    watch: {
      less: {
        files: ['client/default/less/*.less', 'client/default/less/**/.less'],
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

  // Even though we're not setting up config for these, we'll be making use of
  // them in our task, so must load them into grunt.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Here's our custom task...
  grunt.registerMultiTask('fhbuild',
      'Clear and copy the files to relevant dirs for PhoneGap development',
      function() {

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
        var cleanConfig = {};
        cleanConfig[this.target] = [this.data.dir + '*', this.data.dir + '.*'];
        grunt.config('clean', cleanConfig);
        grunt.task.run('clean:' + this.target);

        // For each of the packages we dynamically create the copy config and
        // copy the files over to the appropriate dir.
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

          var copyConfig = {};
          copyConfig[self.target] = {};
          copyConfig[self.target]['files'] = {};
          copyConfig[self.target]['files'][self.data.dir] = packageGlob;

          grunt.config('copy', copyConfig);
          grunt.task.run('copy:' + self.target);
        });
      });

  grunt.registerTask('default', 'less:development');
  grunt.registerTask('ios', 'less:production fhbuild:ios');
};

