/**
 * Module dependencies.
 */
var config = require('./config.json');
var mailer = require('node-mailer');
var amqp = require('amqp');

var connection = amqp.createConnection({ host: 'dev.rabbitmq.com' });

// Wait for connection to become established.
connection.on('ready', function () {
  // Use the default 'amq.topic' exchange
  connection.queue('my-queue', function (q) {
      // Catch all messages
      q.bind('#');

      // Receive messages
      q.subscribe(function (message) {
        // Print messages to stdout
        console.log(message);
      });
  });
});
