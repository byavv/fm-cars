var fakeData = require('./fakeCars');

module.exports = function (app, done) {
    fakeData(app, () => {
        app.start(3010);
    })
    app.once('started', () => {
        done()
    });
};