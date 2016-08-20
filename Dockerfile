FROM node:6.3

# Maintainer
MAINTAINER Aksenchyk V. <aksenchyk.v@gmail.com>

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install strongloop
RUN npm install -g pm2

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3009
<<<<<<< HEAD

=======
>>>>>>> a0dc2d48ee8f0bd7d2af00d00b62e2472311ac22
CMD [ "npm", "run", "pm2" ]
