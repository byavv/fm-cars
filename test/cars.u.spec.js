"use strict"
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const sinon = require('sinon')

const request = require('supertest');
const app = require('../server/server');
var server;

describe('UNIT TESTS', () => {
  describe('Car api unit tests', () => {

    before((done) => {
      app.rabbit = {
        publish: sinon.stub(),
        closeAll: () => { }
      }
      server = app.listen('3010', done);
    });
    after((done) => {
      server.close(done);      
    });


    it('Unit: should get cars from database', (done) => {
      request(app)
        .get('/api/cars/')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, result) => {
          if (err) { return done(err); }
          result.body.should.be.a('array');
          done();
        });
    });

    it('Unit: should create new car', (done) => {
      request(app)
        .post('/api/Cars/new')
        .send({ makerName: 'SUPERCAR', modelName: 'X3' })
        .set('Content-Type', 'application/json')
        .set('X-PRINCIPLE', 'user-id')
        .end((err, result) => {
          if (err) { return done(err); }
          assert.equal(result.status, 200);
          assert.equal(result.body.car.makerName, 'SUPERCAR');
          assert.equal(result.body.car.userId, 'user-id');
          assert.equal(app.rabbit.publish.calledWith('ex.tracker', {
            type: 'tracker.track',
            routingKey: "messages",
            body: {
              carId: `${result.body.car.id}`,
              image: '/static/assets/img/default.png',
              description: `${result.body.car.makerName}, ${result.body.car.modelName}`
            }
          }), true);
          done();
        })
    });

    it('Unit: should fire 400 error code if principle is not set', (done) => {
      request(app)
        .post('/api/Cars/getusercars')
        .set('Content-Type', 'application/json')
        .expect(400)
        .end(done)
    });

    it('Unit: should delete car', (done) => {
      request(app)
        .post('/api/Cars/new')
        .send({ makerName: 'SUPERCAR', modelName: 'X3' })
        .set('Content-Type', 'application/json')
        .set('X-PRINCIPLE', 'user-id')
        .end((err, result) => {
          if (err) { return done(err); }
          let id = result.body.car.id
          request(app)
            .delete(`/api/Cars/${id}`)
            .set('X-PRINCIPLE', 'user-id')
            .end((err, result) => {
              if (err) { return done(err); }
              assert.equal(result.status, 200);
              done();
            })
        })
    });
  });
})

