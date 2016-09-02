[![CircleCI](https://circleci.com/gh/byavv/fm-cars.svg?style=shield)](https://circleci.com/gh/byavv/fm-cars)
[![David](https://img.shields.io/david/byavv/fm-cars.svg?maxAge=2592000)]()
[![](https://images.microbadger.com/badges/image/aksenchyk/fm-cars.svg)](https://microbadger.com/images/aksenchyk/fm-cars "Provided by microbadger.com")
[![Docker Automated build](https://img.shields.io/docker/automated/aksenchyk/fm-cars.svg?maxAge=2592000)]()

## Microservice cars for [funny-market](https://github.com/byavv/funny-market) project

### Features: 
- [rabbitmq](https://www.rabbitmq.com/) messaging via [rabbot](https://github.com/arobson/rabbot)
- [etcd](https://github.com/coreos/etcd) self-registration via [etcd-registry](https://github.com/mafintosh/etcd-registry)

### Usage
```sh
$ npm install -g nodemon 
     ...
$ cd fm-cars
$ npm install
```
### Basic Commands
```sh
$ npm start
$ npm run dev
$ npm test
$ npm run test:unit
$ npm run clean
$ npm run serve
```
### Docker

```sh
# build image
$ bash build.sh
# run unit and integration tests
$ docker-compose -f test_compose.yml up cars_test 
```

