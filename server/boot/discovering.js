const registry = require('etcd-registry'),
    logger = require("../lib/logger");
/**
 * Service discovering
 */
module.exports = function (app) {
    if (process.env.NODE_ENV != 'test') {
        var etcd_host = app.get('etcd_host');
        var http_port = app.get('http_port');
        var microserviceName = app.get('ms_name');

        var services;
        app.once('started', function () {
            app.services = services;
            services = registry(`${etcd_host}:4001`);
            services.join(microserviceName, { port: http_port });
            setTimeout(() => {
                services.lookup(microserviceName, (err, service) => {
                    if (service) {
                        logger.info(`Service on ${service.url} registered as ${microserviceName}`);
                    } else {
                        logger.error(`Service on ${microserviceName} registration failed`);
                        throw new Error(`Registration on etcd key storage on ${etcd_host}:4001 failed`)
                    }
                });
            }, 1000);
        });
    }
};
