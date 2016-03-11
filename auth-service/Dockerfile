FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y wget
RUN apt-get install -y build-essential
# Install nodemon
RUN npm install -g nodemon
EXPOSE 6379
# Run app using nodemon
CMD ["nodemon", "/src/app.js"]
ENTRYPOINT  ["nodejs-server"]
