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
 * Loads up the definitions in the license override file. The override file should be used to correct
 * local projects without committing the license in a manifest file.
 *
 * @param grunt The instance of the grunt system.
 * @param options The plugin options object that contains values defined in the grunt file or default values.
 * @param cb The node.js standard callback to use for returning information to the caller.
 * @returns Object of dependency names and license info from override file. Names are of the form modulename@version (via callback)
 */
var loadOverrideDefinitions = function(grunt, options, cb) {
   var err, overrideData;

   if(grunt.file.exists(options.overrideFile)) {
      try {
         overrideData = grunt.file.readJSON(options.overrideFile)
         if(!_.isEmpty(overrideData)) {
            grunt.log.writeln("The license override file is an anti-pattern. Let's work on getting license info in package manifest files.");
         }
      }
      catch(ex) {
         grunt.log.debug("Is the .license file encoded using strict JSON encoding?");
         err = ex;
      }
   }

   cb(err, overrideData);
};


/**
 * Entry point for the plugin.
 *
 * @param grunt The instance of the grunt system.
 */
module.exports = function(grunt) {

  grunt.registerTask("license", "Generate licensing info based on package.json files", function() {
    var options = this.options({
       overrideFile: ".license",
       output: "licenseReport.json",
       prettyOutput: false
    });

    var done = this.async();

    async.parallel([
       _.partial(loadOverrideDefinitions, grunt, options),
       _.partial(generateNpmLicenseInfo, grunt),
       _.partial(generateBowerLicenseInfo, grunt)
    ],
    function(err, results) {
       if(!err) {
          var overrideLicenses = results[0],
              npmLicenses = results[1],
              bowerLicenses = results[2],
              finalLicenses = _.extend({}, npmLicenses, bowerLicenses, overrideLicenses);

          grunt.log.writeln("Writing module license report to " + options.output);
          grunt.file.write(options.output,
                           JSON.stringify(finalLicenses, null, (options.prettyOutput ? "\t" : null) ));
       } 
       else {
          grunt.log.error(err);
       }

       done(err);
    });


  });
};
