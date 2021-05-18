const glob = require('glob');
const assignin = require('lodash.assignin');
const kebabCase = require('lodash.kebabcase');
const install = require('yeoman-generator/lib/actions/install');
const mkdirp = require('mkdirp');
const path = require('path');
const Generator = require('yeoman-generator');
const yosay = require('yosay');

assignin(Generator.prototype, install);

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.options = opts;

    this.slugify = kebabCase;
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
        'none',
        'ejs',
        'eta',
        'hbs',
        'liquid',
        'njk',
        'pug',
      ],
      default: 'none',
      store: true
    }, {
      type: 'list',
      name: 'cssPreprocessor',
      message: 'Select a css preprocessor to use:',
      choices: [
        'none',
        'less',
        'stylus',
        'sass'
      ],
      default: 'none',
      store: true
    }, {
      type: 'confirm',
      name: 'addTest',
      message: 'Would you like me to add default test for app.js?'
    }, {
      type: 'list',
      name: 'installDependencies',
      message: 'Would you like me to install dependencies?',
      choices: [{
        name: 'No',
        value: 'no',
        checked: true
      }, {
        name: 'Yes, with npm',
        value: 'npm'
      }, {
        name: 'Yes, with yarn',
        value: 'yarn'
      }],
      default: 'no',
      store: true
    }]).then((answers) => {
      this.options.addTest = answers.addTest;
      this.options.createDirectory = answers.createDirectory;
      this.options.cssPreprocessor = answers.cssPreprocessor;
      this.options.dirname = this.slugify(answers.name);
      this.options.installDependencies = answers.installDependencies;
      this.options.viewEngine = answers.viewEngine;
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
      (file) => this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), this)
    );

    // routes
    this.sourceRoot(path.join(__dirname, 'templates', 'routes'));
    glob.sync('**', {
      cwd: this.sourceRoot()
    }).map(
      (file) => this.fs.copyTpl(this.templatePath(file), this.destinationPath(path.join('routes', file)), this)
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
      (file) => this.fs.copy(this.templatePath(file), this.destinationPath(path.join('public', 'stylesheets', file)), this)
    );

    // views
    this.sourceRoot(path.join(__dirname, 'templates', 'views', this.options.viewEngine));
    glob.sync('**', {
      cwd: this.sourceRoot()
    }).map(
      (file) => this.fs.copy(this.templatePath(file), this.destinationPath(path.join('views', file)), this)
    );

    // test
    if (this.options.addTest) {
      this.sourceRoot(path.join(__dirname, 'templates', 'test'));
      glob.sync('**', {
        cwd: this.sourceRoot()
      }).map(
        (file) => this.fs.copy(this.templatePath(file), this.destinationPath(path.join('test', file)), this)
      );
    }
  }

  install() {
    if (this.options.installDependencies === 'npm') {
      this.npmInstall();
    }
    if (this.options.installDependencies === 'yarn') {
      this.yarnInstall();
    }
    /* eslint no-console: 0 */
    console.log(yosay(`Run the app:
$ npm start`));
  }
};
