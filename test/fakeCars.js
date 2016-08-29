const debug = require('debug')('test')
module.exports = function seedTestData(app, done) {
    let Car = app.models.Car;
    Car.destroyAll({}, () => {
        Car.create([
            {
                images: [{ url: "/test.jpg", key: 'key' }],
                milage: 0,
                year: 0,
                price: 0,
                added: Date.now(),
                makerName: 'gravitsapa motors co.',
                modelName: 'pepelats',
                color: 'cosmos',
                makerId: 1,
                carModelId: 1,
                userId: '1'
            },
            {
                images: [{ url: "/test.jpg", key: 'key' }],
                milage: 0,
                year: 0,
                price: 0,
                added: Date.now(),
                makerName: 'gravitsapa motors co.',
                modelName: 'pepelats',
                color: 'cosmos',
                makerId: 1,
                carModelId: 1,
                userId: '1'
            },
            {
                images: [{ url: "/test.jpg", key: 'key' }],
                milage: 0,
                year: 0,
                price: 0,
                added: Date.now(),
                makerName: 'gravitsapa motors co.',
                modelName: 'pepelats',
                color: 'cosmos',
                makerId: 1,
                carModelId: 1,
                userId: '1'
            },
            {
                images: [{ url: "/test.jpg", key: 'key' }],
                milage: 0,
                year: 0,
                price: 0,
                added: Date.now(),
                makerName: 'gravitsapa motors co.',
                modelName: 'pepelats',
                color: 'cosmos',
                makerId: 1,
                carModelId: 1,               
                userId: '2'
            },

        ], (err, configs) => {
            done(err)
        })
    })
};