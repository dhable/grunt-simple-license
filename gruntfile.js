/*
 * grunt-simple-license
 *
 * Copyright (c) 2014 Dan Hable.
 * Licensed under the BSD license. See the LICENSE file for complete details.
 */

'use strict';

module.exports = function(grunt) {
   require("load-grunt-tasks")(grunt);

   grunt.initConfig({
      jshint: {
         all: [
            "gruntfile.js",
            "tasks/*.js"
         ],
         options: {
            jshintrc: ".jshintrc"
         }
      }
   });

   grunt.registerTask("default", ["jshint"]);
};
