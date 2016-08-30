"use strict"
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const sinon = require('sinon')

const superagent = require('superagent');
const app = require('../server/server');
const messaging = require('../server/boot/messaging');
const request = require("supertest")(app)

let Car, client;

describe('INTERGRATION TESTS', () => {

    before(function (done) {
        require('./init-server')(app, done)
    });

    after((done) => {
        client.closeAll();
        app.close(done)
    });


    before((done) => {
        client = require('rabbot');
        Car = app.models.Car;

        require('../server/lib/topology')(client, {
            name: 'cars',
            host: app.get('rabbit_host')
        })
            .then(done)
            .catch((err) => {
                done(err);
            })
    })

    it('Integration: Should delete all cars from database by userId and delete images from storage', (done) => {

        client.request('ex.cars', {
            routingKey: "requests",
            type: 'cars.delete.all',
            contentType: "application/json",
            body: '1'
        })
            .then((final) => {                
                final.ack();
            })
            .then(() => {
                Car.find({}, (err, cars) => {
                    assert.equal(cars.length, 1);
                    done();
                })
            })
            .catch((err) => {
                done(err);
            });
    });

    it('Integration: Should update cars images and notify tracker', (done) => {
        Car.find({}, (err, cars) => {
            assert.equal(cars.length, 1);
            const id = cars[0].id;
            client.publish('ex.cars', {
                type: 'cars.update.images',
                routingKey: "messages",
                contentType: "application/json",
                body: {
                    carId: id,
                    files: [
                        { location: "/testimage.jpg", key: 'testkey' },
                        { location: "/testimage2.jpg", key: 'testkey2' }
                    ]
                }
            }).then(() => {
                setTimeout(() => {
                    Car.findById(id, (err, car) => {
                        assert.equal(car.images.length, 3)
                        done();
                    })
                }, 300)
            }).catch((err) => {
                done(err);
            });
        });
    });
});
