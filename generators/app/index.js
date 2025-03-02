import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url'; // Add this import
import { kebabCase } from 'lodash-es';
import { glob } from 'glob';
import Generator from 'yeoman-generator';
import yosay from 'yosay';
import { mkdirp } from 'mkdirp';

// Define __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.options = opts;
    this.slugify = kebabCase; // Add slugify function
  }

  prompting() {
    this.log(yosay('Welcome to the Generator express-es6! 🎉'));

    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Please enter your project name',
        default: this.appname,
      },
      {
        type: 'confirm',
        name: 'createDirectory',
        message: 'Would you like to create a new directory for your project?',
      },
      {
        type: 'list',
        name: 'viewEngine',
        message: 'Select a view engine to use:',
        choices: ['none', 'ejs', 'eta', 'hbs', 'liquid', 'njk', 'pug'],
        default: 'none',
        store: true,
      },
      {
        type: 'list',
        name: 'cssPreprocessor',
        message: 'Select a CSS preprocessor to use:',
        choices: ['none', 'less', 'stylus', 'sass'],
        default: 'none',
        store: true,
      },
      {
        type: 'confirm',
        name: 'addTest',
        message: 'Would you like to add default tests for app.js?',
      },
      {
        type: 'list',
        name: 'installDependencies',
        message: 'Which package manager do you want to use?',
        choices: ['npm', 'yarn'],
        default: 'npm',
      },
    ]).then((answers) => {
      this.options = answers;
      // Slugify the project name for directory creation
      this.options.dirname = this.slugify(this.options.name);
    });
  }

  writing() {
    try {
      // Create a new directory if requested
      if (this.options.createDirectory) {
        this.destinationRoot(this.options.dirname);
        this.appname = this.options.dirname;
        this.log(`Created directory: ${this.options.dirname}`);
      }

      // Define template context
      const templateContext = {
        appname: this.appname, // Pass appname to templates
        slugify: this.slugify, // Pass slugify to templates
        options: this.options, // Include all other options
      };

      // Copy common files
      this.sourceRoot(path.join(__dirname, 'templates', 'common'));
      glob.sync('**', {
        cwd: this.sourceRoot(),
        dot: true,
      }).forEach((file) => {
        this.fs.copyTpl(
          this.templatePath(file),
          this.destinationPath(file),
          templateContext // Use the template context
        );
      });

      // Copy routes
      this.sourceRoot(path.join(__dirname, 'templates', 'routes'));
      glob.sync('**', {
        cwd: this.sourceRoot(),
      }).forEach((file) => {
        this.fs.copyTpl(
          this.templatePath(file),
          this.destinationPath(path.join('routes', file)),
          templateContext // Use the template context
        );
      });

      // Create public directories
      mkdirp.sync(this.destinationPath('public/images'));
      mkdirp.sync(this.destinationPath('public/javascripts'));
      mkdirp.sync(this.destinationPath('public/stylesheets'));
      this.log('Created public directories.');

      // Copy stylesheets based on the selected preprocessor
      if (this.options.cssPreprocessor !== 'none') {
        this.sourceRoot(path.join(__dirname, 'templates', 'css', this.options.cssPreprocessor));
        glob.sync('**', {
          cwd: this.sourceRoot(),
        }).forEach((file) => {
          this.fs.copy(
            this.templatePath(file),
            this.destinationPath(path.join('public', 'stylesheets', file))
          );
        });
        this.log(`Copied ${this.options.cssPreprocessor} stylesheets.`);
      }

      // Copy views based on the selected view engine
      if (this.options.viewEngine !== 'none') {
        this.sourceRoot(path.join(__dirname, 'templates', 'views', this.options.viewEngine));
        glob.sync('**', {
          cwd: this.sourceRoot(),
        }).forEach((file) => {
          this.fs.copy(
            this.templatePath(file),
            this.destinationPath(path.join('views', file))
          );
        });
        this.log(`Copied ${this.options.viewEngine} views.`);
      }

      // Copy tests if requested
      if (this.options.addTest) {
        this.sourceRoot(path.join(__dirname, 'templates', 'test'));
        glob.sync('**', {
          cwd: this.sourceRoot(),
        }).forEach((file) => {
          this.fs.copy(
            this.templatePath(file),
            this.destinationPath(path.join('test', file))
          );
        });
        this.log('Copied test files.');
      }

      this.log('Writing phase completed successfully! 🎉');
    } catch (err) {
      this.log(`Error during writing phase: ${err.message} 🚨`);
    }
  }

  install() {
    this.log('Starting installation phase...');

    let command, args;

    // Decide which package manager to use
    if (this.options.installDependencies === 'npm') {
      command = 'npm';
      args = ['install'];
    } else if (this.options.installDependencies === 'yarn') {
      command = 'yarn';
      args = ['install'];
    }

    if (command && args) {
      // Spawn the command asynchronously
      const child = spawnSync(command, args, { cwd: this.destinationRoot(), stdio: 'inherit' });

      if (child.error) {
        this.log(`Error during installation: ${child.error.message}`);
      } else if (child.status === 0) {
        this.log('Dependencies installed successfully');
      } else {
        this.log(`Installation failed with code ${child.status}`);
      }
    }

    this.log(yosay(`Run the app:
$ npm start`));
  }
}