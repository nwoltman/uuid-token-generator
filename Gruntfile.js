/* eslint-disable camelcase, global-require, no-sync */

'use strict';

module.exports = function(grunt) {
  require('jit-grunt')(grunt)({
    customTasksDir: 'tasks',
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      all: ['*.js', 'test/*.js'],
    },

    mochaTest: {
      test: {
        src: 'test/*.js',
      },
      options: {
        colors: true,
      },
    },

    mocha_istanbul: {
      coverage: {
        src: 'test/*.js',
        options: {
          reportFormats: ['html'],
        },
      },
      coveralls: {
        src: 'test/*.js',
        options: {
          coverage: true,
          reportFormats: ['lcovonly'],
        },
      },
      options: {
        mochaOptions: ['--colors'],
      },
    },
  });

  grunt.event.on('coverage', function(lcov, done) {
    require('coveralls').handleInput(lcov, done);
  });

  // Register tasks
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', [process.env.CI ? 'mocha_istanbul:coveralls' : 'mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
  grunt.registerTask('default', ['lint', 'test']);

  grunt.registerTask('changelog', 'Add the changes since the last release to the changelog', function() {
    var done = this.async();

    var pkg = grunt.config.getRaw('pkg');
    var repoUrl = pkg.repository.url;
    var command =
      'git --no-pager log v' + pkg.version + '... --pretty=format:"+ %s ([view](' + repoUrl + '/commit/%H))"';

    require('child_process').exec(command, function(error, stdout) {
      if (error) {
        grunt.log.error('There was an error reading the git log output.');
        grunt.fail.fatal(error);
      }

      var fs = require('fs');
      var code = fs.readFileSync(pkg.main, {encoding: 'utf8'});
      var curVersion = /@version (\d+\.\d+\.\d+)/.exec(code)[1];
      var date = new Date().toISOString().slice(0, 10);
      var versionHeader = '## ' + curVersion + ' (' + date + ')\n';
      var changelog = fs.readFileSync('CHANGELOG.md', {encoding: 'utf8'});

      if (changelog.indexOf(versionHeader, 13) >= 0) {
        grunt.log.error('Changelog already updated.');
        done();
        return;
      }

      var changes =
        stdout
          // Filter out messages that don't need to be in the changelog
          .replace(/^\+ (?:Update|Merge).*[\r\n]*/gm, '')
          // Generate links to the docs for mentioned functions
          .replace(/[#.](\w+)\(\)/g, '[`.$1()`](' + repoUrl + '#Array#$1)');

      changelog = '# CHANGELOG\n\n' +
                  versionHeader + changes + '\n' +
                  changelog.replace(/^# CHANGELOG\s+/, '\n'); // Remove the current header

      fs.writeFile('CHANGELOG.md', changelog, done);
      grunt.log.ok('Added changes to the changelog.');
    });
  });
};
