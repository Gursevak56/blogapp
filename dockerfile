FROM node:18.16.1
WORKDIR /the/workdir/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm" "start" ]