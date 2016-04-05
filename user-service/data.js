/**
 * How many times when setting up a site and you want to load a bunch of users into your site?
 */
var mongo = require('mongodb');
var assert = require('assert');

var client = mongo.MongoClient;

client.connect('mongodb://localhost:27017/test', function(err, db) {

  if (err) {
    console.log(err.message);
    return;
  }

  /*
  // Get the collection
  var col = db.collection('users');

  var users = [
  {
    username: 'roughbits01',
    fullname: 'Marwen Azouzi',
    email: 'marwen.azouzi@gmail.com',
    password: '$2a$04$Kgu5AsT6pBeRD2srWKZ7HukSGGQ9zS3JtrO5Pp1dhSOkOJ5MgHvqW',//0000
    role: 'founder',
    picture: 'http://www.gravatar.com/avatar/0f1f4ae5e7d998c23afc782dfd1df6b9?s=200',
    created: Date.now()
  },
  {
    username: 'kappa',
    fullname: 'Marwen Azouzi',
    email: 'marwen.azouzi@gmail.com',
    password: '$2a$04$Kgu5AsT6pBeRD2srWKZ7HukSGGQ9zS3JtrO5Pp1dhSOkOJ5MgHvqW',//0000
    role: 'user',
    picture: 'http://www.gravatar.com/avatar/0f1f4ae5e7d998c23afc782dfd1df6b9?s=200',
    created: Date.now()
  }];

  col.insertMany(users, function(err, res) {
    assert.equal(null, err);
    assert.equal(users.length, res.insertedCount);
    // Finish up test
    db.close();
  });*/

  var col = db.collection('boards');
  var boards = [{
    name: 'random',
    description: 'random posts'
  }];
  col.insertMany(boards, function(err, res) {
    assert.equal(null, err);
    assert.equal(boards.length, res.insertedCount);
    // Finish up test
    db.close();
  });
});

var threads = [{
  title: 'YLYL',
  text: 'Let\'s start the week off right',
  board: 'random'
}];
