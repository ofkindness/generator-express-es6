/* eslint strict: 0 */

'use strict';

const Generator = require('yeoman-generator');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const path = require('path');
const glob = require('glob');
const yosay = require('yosay');

class ExpressGenerator extends Generator {
  constructor(args, options) {
    super(args, options);

    this.options = options;

    this.slugify = _.kebabCase;
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Please enter your project name',
      default: this.appname // Default to current folder name
    }, {
      type: 'confirm',
      name: 'createDirectory',
      message: 'Would you like to create a new directory for your project?'
    }, {
      type: 'list',
      name: 'viewEngine',
      message: 'Select a view engine to use:',
      choices: [
        'ejs',
        'pug'
      ],
      store: true
    }, {
      type: 'list',
      name: 'cssPreprocessor',
      message: 'Select a css preprocessor to use:',
      choices: [
        'less',
        'stylus',
        'sass'
      ],
      store: true
    }, {
      type: 'confirm',
      name: 'installDependencies',
      message: 'Would you like me to install dependencies?'
    }]).then((answers) => {
      this.options.dirname = this.slugify(answers.name);
      this.options.createDirectory = answers.createDirectory;
      this.options.viewEngine = answers.viewEngine;
      this.options.cssPreprocessor = answers.cssPreprocessor;
      this.options.installDependencies = answers.installDependencies;
    });
  }

  writing() {
    if (this.options.createDirectory) {
      this.destinationRoot(this.options.dirname);
      this.appname = this.options.dirname;
    }

    // common
    this.sourceRoot(path.join(__dirname, 'templates', 'common'));
    glob.sync('**', {
      cwd: this.sourceRoot(),
      dot: true
    }).map(
      file => this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), this)
    );

    // routes
    this.sourceRoot(path.join(__dirname, 'templates', 'routes'));
    glob.sync('**', {
      cwd: this.sourceRoot()
    }).map(
      file => this.fs.copy(this.templatePath(file), this.destinationPath(path.join('routes', file)), this)
    );

    // public
    mkdirp.sync('public/images');
    mkdirp.sync('public/javascripts');
    mkdirp.sync('public/stylesheets');

    // stylesheets
    this.sourceRoot(path.join(__dirname, 'templates', 'css', this.options.cssPreprocessor));
    glob.sync('**', {
      cwd: this.sourceRoot()
    }).map(
      file => this.fs.copy(this.templatePath(file), this.destinationPath(path.join('public', 'stylesheets', file)), this)
    );

    // views
    this.sourceRoot(path.join(__dirname, 'templates', 'views', this.options.viewEngine));
    glob.sync('**', {
      cwd: this.sourceRoot()
    }).map(
      file => this.fs.copy(this.templatePath(file), this.destinationPath(path.join('views', file)), this)
    );
  }

  install() {
    if (this.options.installDependencies) {
      this.installDependencies({
        npm: true,
        bower: false
      });
    }
    console.log(yosay(`Run the app:
$ DEBUG=${this.appname}:* npm start`));
  }
}

module.exports = ExpressGenerator;
