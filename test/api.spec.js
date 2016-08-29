"use strict"
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const sinon = require('sinon')

const app = require('../server/server');
const request = require("supertest")
var server;
describe('SEARCH API TESTS', function () {

    before(() => {
        app.rabbit = {
            publish: sinon.stub()
        }
    });
    before((done) => {
        server = app.listen('3010', done);
    });
    after((done) => {
        server.close(done);
    });

    it('should find cars in database', function (done) {
        request(app)
            .post('/api/cars/search')
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, result) {
                if (err) { return done(err); }
                result.body.should.be.a('array');
                done();
            });
    });
});
