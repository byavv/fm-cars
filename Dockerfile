FROM node:6.3

# Maintainer
MAINTAINER Aksenchyk V. <aksenchyk.v@gmail.com>

# Define app directory
WORKDIR /usr/src/app

# Create app directory
RUN mkdir -p /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Copy app sources
COPY . /usr/src/app

EXPOSE 3009

CMD [ "npm", "start"]
