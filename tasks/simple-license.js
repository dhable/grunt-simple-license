/*
 * grunt-simple-license
 *
 * Copyright (c) 2014 Dan Hable.
 * Licensed under the BSD license. See the LICENSE file for complete details.
 */

'use strict';

var path = require("path"),
    _ = require("lodash"),
    async = require("async"),
    bower = require("bower");


/**
 * Walks through the NPM dependencies looking for license information.
 * 
 * @param grunt The instance of the grunt system.
 * @param cb The node.js standard callback to use for returning information to the caller.
 * @returns Object of dependency names and license info blocks. Names are of the form modulename@version (via callback)
 */
var generateNpmLicenseInfo = function(grunt, cb) {
   var content,
       pkgPath,
       licenseMap = {},
       remainingModules = ["package.json"];

   while(pkgPath = remainingModules.shift()) {
      grunt.log.debug("inspecting " + pkgPath);

      if(grunt.file.exists(pkgPath)) {
         content = grunt.file.readJSON(pkgPath);
 
         // Skip the root package.json file to avoid adding ourself as a dependency on ourself. 
         if(pkgPath !== "package.json") {
            licenseMap[content.name + "@" + content.version] = content.license || "Unspecified";
         }

         for(var key in content.dependencies) {
            remainingModules.push(path.join( path.dirname(pkgPath), "node_modules", key, "package.json"));
         }
      }
   }

   cb(null, licenseMap);
};


/**
 * Walks thr bower dependencies looking for license information.
 * 
 * @param grunt The instance of the grunt system.
 * @param cb The node.js standard callback to use for returning information to the caller.
 * @returns Object of dependency names and license info blocks. Names are of the form modulename@version (via callback)
 */
var generateBowerLicenseInfo = function(grunt, cb) {

   /**
    * Helper function that transforms the bower API call data into a
    * license map.
    */
   var processBowerData = function(data) {
      var pkg,
          licenseMap = {},
          dependencies = _.values(data.dependencies);

      while(pkg = dependencies.shift()) {
         licenseMap[ pkg.pkgMeta.name + "@" + pkg.pkgMeta.version ] = pkg.pkgMeta.license || "unspecified";

         dependencies = dependencies.concat(_.values( pkg.dependencies ));
      }

      cb(null, licenseMap);
   };

   bower.commands
        .list([], {relative: true, json: true})
        .on("end", processBowerData);
};


/**
 *
 */
module.exports = function(grunt) {

  grunt.registerTask("license", "Generate licensing info based on package.json files", function() {
    var options = this.options({
    });


    var done = this.async();

    async.parallel([
       _.partial(generateNpmLicenseInfo, grunt),
       _.partial(generateBowerLicenseInfo, grunt)
    ],
    function(err, results) {
       var licenses = _.extend({}, results[0], results[1]);
       console.log(licenses);
    });

  });

};
