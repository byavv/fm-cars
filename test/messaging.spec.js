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
var server, server2;
var Car;
var rabbitClient;
describe('INTERGRATION TESTS', function () {
    const rabbit = require('wascally')
    before(function (done) {

        require('./init-server')(app, () => {
            Car = app.models.Car;
            require('../server/lib/topology')(rabbit, {
                name: 'cars',
                host: 'localhost'
            })
                .then(messaging(app).handle)
                .then(() => {
                    console.log('connection establishers');
                    rabbitClient = rabbit;
                    done()
                })
                .catch((err) => {
                    logger.error(`Error when joining rabbit network: ${err}`);
                    throw err;
                });
        })
    });

    after((done) => {
        app.rabbit.closeAll();
        app.close(done)
    });


    it('Integration: should delete all cars from database', (done) => {
        rabbitClient.request('ex.cars', {
            routingKey: "requests",
            type: 'cars.delete.all',
            body: '1'
        })
            .then((final) => {
                console.log("ALL BOUND CARS WAS DELETED: ", final.body);
                final.ack();
            })
            .then(() => {
                console.log('GOT THOMETHING')
                Car.find({}, (err, cars) => {
                    assert.equal(cars.length, 1);
                    done();
                })
            })
            .catch((err) => {
                done(err);
            });
    });

    it('Should update cars images', (done) => {
        Car.find({}, (err, cars) => {
            assert.equal(cars.length, 1);
            const id = cars[0].id;
            rabbitClient.publish('ex.cars', {
                type: 'cars.update.images',
                routingKey: "messages",
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
