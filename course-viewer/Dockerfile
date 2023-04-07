# pull official base image
FROM node:19.8.1-alpine3.17

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./

RUN npm install --force

# Bundle app source
COPY . ./

# start app
CMD ["npm", "start"]