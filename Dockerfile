FROM node:8
# Create app directory
WORKDIR /restapi-nodejs/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 8080
CMD [ "npm", "start" ]