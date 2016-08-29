[![CircleCI](https://circleci.com/gh/byavv/fm-cars.svg?style=svg)](https://circleci.com/gh/byavv/fm-cars)
[![](https://images.microbadger.com/badges/image/aksenchyk/fm-cars.svg)](https://microbadger.com/images/aksenchyk/fm-cars "Provided by microbadger.com")

## Microservice cars for [funny-market](https://github.com/byavv/funny-market) project

### Features: 
- [rabbitmq](https://www.rabbitmq.com/) messaging via [wascally](https://github.com/LeanKit-Labs/wascally)
- [etcd](https://github.com/coreos/etcd) self-registration via [etcd-registry](https://github.com/mafintosh/etcd-registry)

### Usage

    npm install -g nodemon 
     ...
    cd fm-cars
    npm install

### Basic Commands

    npm start
    npm run dev
    npm test
    npm run clean
    npm run serve

