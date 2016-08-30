"use strict"
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const sinon = require('sinon')

const app = require('../server/server');
const request = require("supertest");
const fakeData = require('./fakeCars');


describe('UNIT TESTS', () => {
    describe('Search api unit tests', () => {
        let server;
        before(() => {
            app.rabbit = {
                publish: sinon.stub()
            }
        });
        before((done) => {
            fakeData(app, () => {
                server = app.listen('3010', done);
            });
        });
        after((done) => {
            app.models.Car.destroyAll(() => {
                server.close(done);
            })
        });
        it('Unit: should find cars in database', function (done) {
            request(app)
                .post('/api/cars/search')
                .set('Content-Type', 'application/json')
                .expect(200)
                .end((err, result) => {
                    if (err) { return done(err); }
                    result.body.should.be.a('array');
                    expect(result.body.length).to.equal(4);
                    done();
                });
        });

        it('Unit: should construct database request', function (done) {
            request(app)
                .post('/api/cars/search')
                .set('Content-Type', 'application/json')
                .send({ model: "pepelats", maker: "gravitsapa motors co." })
                .expect(200)
                .end((err, result) => {
                    if (err) { return done(err); }
                    result.body.should.be.a('array');
                    expect(result.body.length).to.equal(3);
                    done();
                });
        });
    });
})
