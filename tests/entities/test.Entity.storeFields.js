var sinon = require('sinon');

var path = require('path');
var Promise = require('bluebird');
var ErrorX = require('codeflyer-errorx');
var EntityX = require('../../lib/EntityX');
var Entity = require('../../lib/entities/Entity');

describe('Object: storeFields', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('storeField without fields set', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    model._isLoad = true;
    var stub = sinon.stub(model, '_getDataForSave');
    var MockDriver = function(id) {
      this.update = function(values) {
        return Promise.resolve();
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));

    model.storeFields([]).then(
        function() {
          stub.callCount.should.be.equal(0);
          model._isLoad.should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('storeField with 1 fields set', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    model._isLoad = true;
    var stub = sinon.stub(model, '_getDataForSave');
    stub.onCall(0).returns('value1');

    var MockDriver = function(id) {
      this.update = function(values) {
        values.should.be.eql({field1: 'value1'});
        return Promise.resolve();
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));
    model.storeFields(['field1']).then(
        function() {
          stub.getCall(0).calledWith('field1').should.be.true;
          stub.callCount.should.be.equal(1);
          model._isLoad.should.be.false;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('storeField with 3 fields set', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    model._isLoad = true;
    var stub = sinon.stub(model, '_getDataForSave');
    stub.onCall(0).returns('value1');
    stub.onCall(1).returns('value2');
    stub.onCall(2).returns('value3');

    var MockDriver = function(id) {
      this.update = function(values) {
        values.should.be.eql({
          field1: 'value1',
          field2: 'value2',
          field3: 'value3'
        });
        return Promise.resolve();
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));
    model.storeFields(['field1', 'field2', 'field3']).then(
        function() {
          stub.getCall(0).calledWith('field1').should.be.true;
          stub.getCall(1).calledWith('field2').should.be.true;
          stub.getCall(2).calledWith('field3').should.be.true;
          stub.callCount.should.be.equal(3);
          model._isLoad.should.be.false;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('storeField not existent field', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    model._isLoad = true;
    var stub = sinon.stub(model, '_getDataForSave');
    stub.onCall(0).stub.throws('Some Error');

    var MockDriver = function(id) {
      this.update = function(values) {
        values.should.be.eql({
          field1: 'value1',
          field2: 'value2',
          field3: 'value3'
        });
        return Promise.resolve();
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));
    model.storeFields(['field1', 'field2', 'field3']).then(
        function() {
          done('this method should give an exception');
        }
    ).catch(function(err) {
          err.code.should.be.equal(150);
          done();
        });
  });

  it('driver update error', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var stub = sinon.stub(model, '_getDataForSave');
    stub.onCall(0).returns('value1');

    var MockDriver = function() {
      this.update = function(values) {
        values.should.be.eql({field1: 'value1'});
        throw new ErrorX(500, 'mongodberror');
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));
    model.storeFields(['field1']).then(
        function() {
          done('this method should give an exception');
        }
    ).catch(function(err) {
          err.code.should.be.equal(500);
          done();
        });
  });
});
