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
      }
    },
    watch: {
      less: {
        files: ['client/default/less/*.less', 'client/default/less/**/.less'],
        tasks: 'default'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', 'less:development');
};

