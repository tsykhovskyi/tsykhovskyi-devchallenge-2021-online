FROM node:14

WORKDIR /application
COPY . /application

RUN npm install
RUN npx tsc

EXPOSE 8080
CMD [ "node", "dist/app.js" ]
