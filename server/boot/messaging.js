'use strict'
const rabbit = require('rabbot')
    , debug = require('debug')('ms:cars')
    , logger = require("../lib/logger");

module.exports = function (app) {
    rabbit.on('unreachable', () => {
        logger.error(`Error connecting RabbitMQ instance on ${app.get("rabbit_host")}:5672: UNREACHABLE`);
        process.exit(1);
    });
    var Car = app.models.Car;
    function configureHandlers(rabbit) {
        rabbit.handle('cars.delete.all', (message) => {
            debug(`Deleting cars for user: ${message.body}`)
            Car.destroyAll({ userId: message.body }, (err, info, count) => {
                if (err) {
                    message.nack();
                } else {
                    message.reply(info);
                }
            })
        });
        rabbit.handle('cars.delete.image', (message) => {
            var carId = message.body.carId;
            var key = message.body.key;
            Car.findById(carId, (err, carInst) => {
                if (err || !carInst) { message.nack(); return; }
                let image = carInst.images.find(image => image.key == key);
                if (image) {
                    carInst.images.splice(carInst.images.indexOf(image), 1);
                    Car.updateAll({ id: carId }, carInst, (err, info) => {
                        err
                            ? message.nack()
                            : message.ack();
                    });
                } else {
                    message.reject();
                }
            })
        });
        rabbit.handle('cars.update.images', (message) => {
            const carId = message.body.carId;
            const files = message.body.files;

            Car.findById(carId, (err, carInst) => {
                if (err || !carInst) { message.nack(); return; }
                const images = (files || []).map((file) => {
                    return {
                        url: file.location,
                        key: file.key
                    }
                });
                carInst.images = carInst.images.concat(images);
                Car.updateAll({ id: carId }, carInst, (err, info) => {
                    err
                        ? message.nack()
                        : rabbit.publish('ex.tracker', {
                            type: 'tracker.update',
                            routingKey: "messages",
                            body: {
                                carId: `${carInst.id}`,
                                image: carInst.images ? carInst.images[0].url : '/static/assets/img/default.png',
                                description: `${carInst.makerName}, ${carInst.modelName}`
                            }
                        }).then(() => {
                            message.ack();
                        }).catch(err => {
                            message.nack();
                        });
                })
            });
        });
    }

    app.once('started', () => {
        require('../lib/topology')(rabbit, {
            name: app.get('ms_name'),
            host: app.get('rabbit_host')
        })
            .then(() => configureHandlers(rabbit))
            .then(() => {
                app.rabbit = rabbit;
                logger.info('Rabbit client started');
            })
            .catch((err) => {
                logger.error(`Error establishing RabbitMq connection: ${err}`);
                throw err;
            })
    });
    return configureHandlers;
}
