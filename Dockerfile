FROM node:14

WORKDIR /usr/src/app
COPY ./ ./
RUN npm install
# Create app directory
WORKDIR /usr/src/app/backend
RUN npm install

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./backend/package*.json ./

WORKDIR /usr/src/app/backend
RUN npm run build
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
EXPOSE 8000
CMD [ "node", "server.js" ]
