# grunt-simple-license

> Scans NPM and Bower packages looking for licenseing information.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-simple-license --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-simple-license');
```

## The "license" task

### Overview
In your project's Gruntfile, add a section named `license` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  license: {
    options: {
      overrideFile: ".license",
      output: "licenseReport.json",
      prettyOutput: false
    }
  }
});
```

### Options

#### options.overrideFileA
Type: `String`

Relative path and filename of the license info override file. These defintions will be merged into the final
license report object before it gets output. If you're in an environment that needs to account for all third party
licenses and a module does not define a license, then you can add the definition in this file to make the reports
have license data.

You should really, really, really try to avoid using an override file. Instead, you should consider making a pull
request to the third party module with the SPDX license info so the overall ecosystem is improved.

#### options.output
Type: `String`

The file you would like to output the JSON license map to.

#### options.prettyOutput
Type: `Boolean`

Set to true if you would like the JSON object in the output file to be pretty printed. Defaults to false.


### Usage Examples

Running grunt license will now return a JSON object with the module name@version as the key and the license information specified as the value. If the package does not have a license specified, then the string "unspecified" will be returned.

Unlike other packages, this plugin only uses information in the package.json and bower.json files to obtain the licenseing info. Why? Because as responsible creators and maintainer of open source ecosystems we should CYA and label our work with SPDX licenses in the mainfest files. Creative hacks to derrive that information from the content of a LICENSE file or other solutions are just maintaining a legal grey area that can only come back to haunt us.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
