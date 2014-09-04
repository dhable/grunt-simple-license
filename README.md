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
In your project's Gruntfile, add a section named `waitfor` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  license: {
  }
});
```

### Usage Examples

Running grunt license will now return a JSON object with the module name@version as the key and the license information specified as the value. If the package does not have a license specified, then the string "unspecified" will be returned.

Unlike other packages, this plugin only uses information in the package.json and bower.json files to obtain the licenseing info. Why? Because as responsible creators and maintainer of open source ecosystems we should CYA and label our work with SPDX licenses in the mainfest files. Creative hacks to derrive that information from the content of a LICENSE file or other solutions are just maintaining a legal grey area that can only come back to haunt us.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
