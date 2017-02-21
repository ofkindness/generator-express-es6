/* eslint strict: 0 */
/* eslint prefer-arrow-callback: 0 */

'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-express-es-6:app', function() {
  before(function() {
    return helpers.run(path.join(__dirname, '../app'))
      .withPrompts({
        someAnswer: true
      })
      .toPromise();
  });

  it('creates files', function() {
    assert.file([
      'dummyfile.txt'
    ]);
  });
});
