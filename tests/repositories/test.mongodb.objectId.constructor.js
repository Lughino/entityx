var ObjectID = require('mongodb').ObjectID;
var MongoDBObjectID = require('./../../lib/repositories/MongoDBObjectID');
var errorCodes = require('./../../lib/errorCodes');

describe('Repositories, MongoDBObjectID: Constructor', function() {

  it('Empty params in constructor', function() {
    (function() {
      new MongoDBObjectID();
    }).should.throw('Driver initialization require params');
  });

  it('Check if params pass to parent', function() {
    var driver = new MongoDBObjectID({'collectionName': 'coll_name'});
    driver.collectionName.should.equal('coll_name');
  });

  it('Identifier null', function() {
    var driver = new MongoDBObjectID({'collectionName': 'coll_name'}, null);
    (driver.getId() === null).should.be.true;
  });

  it('Identifier string (not valid)', function() {
    try {

      new MongoDBObjectID({'collectionName': 'coll_name'}, 'hello');
    } catch (e) {
      e.code.should.be.equal(errorCodes.INVALID_PARAMS);
      e.parentError.message.should.be.equal(
          'Argument passed in must be a single String of ' +
          '12 bytes or a string of 24 hex characters');
    }
  });

  it('Identifier integer', function() {
    var driver = new MongoDBObjectID({'collectionName': 'coll_name'}, 10);
    (driver.getId() === null).should.be.false;
  });

  it('Identifier ObjectID', function() {
    var driver =
        new MongoDBObjectID({'collectionName': 'coll_name'}, new ObjectID());
    driver.getId().should.be.instanceOf(ObjectID);
  });
});
