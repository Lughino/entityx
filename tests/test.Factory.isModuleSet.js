var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');
var path = require('path');
require('should');

describe('Factory: isModuleSet', function() {

  var rootPath = path.join(__dirname, '..');

  beforeEach(function() {
    EntityX._reset();
    Factory.reset();
  });

  it('Test isModuleSet (false)', function() {
    EntityX.setApplicationRoot(rootPath);
    EntityX.isModuleSet('TestModule').should.be.false;
  });

  it('Test isModuleSet (true)', function() {
    EntityX.setApplicationRoot(rootPath);
    EntityX.addModule('tests/classesTest');
    EntityX.isModuleSet('TestModule').should.be.true;
  });
});
