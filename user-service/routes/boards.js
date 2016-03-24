var Board = require('../models/board');
var Thread = require('../models/thread');
var express = require('express');
var router = express.Router();

//GET /boards
//POST /boards
//GET /boards/:name
//GET /boards/:name/threads
//POST /boards/:name/threads

router.route('/')
.get(function(req, res) {
  Board.find().exec(function(err, boards) {
    if (err) {
      return res.status(500).json({ message : 'Boards could not be retrieved from database. Please try again.' });
    }
    res.json(boards);
  });
})
.post(function(req, res) {
  Board.count({ name: req.body.name }, function(err, count) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (count > 0) {
      return res.status(409).send({ message: 'Board with that name already exists' });
    }
    var board = new Board({
      name: req.body.name,
      description: req.body.description,
    });
    board.save(function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message : 'Internal Server Error' });
      }
      res.location('/boards/' + result.name);
      res.status(201).json(result);
    });
  });
});

router.route('/:name')
.get(function(req, res) {
  Board.findOne({ name: req.params.name }, function(err, board) {
    if (err) {
      return res.status(500).json({ message : 'Board could not be retrieved from database.' });
    }
    if (board) return res.json(board);
    else res.status(404).json();
  });
});

router.route('/:name/threads')
.get(function(req, res) {
  // First locates the board by name, then locates the threads by the board ID.
  Board.findOne({ name: req.params.name }, function(err, board) {
    if (err) {
      return res.status(500).json({ message : 'Board could not be retrieved from database.' });
    }
    if (!board) return res.status(404).json({ message: 'Board not found' });
    Thread.find({ board: board.name}, function(err, threads) {
      if (err) {
        return res.status(500).json({ message : 'Threads could not be retrieved from database.' });
      }
      res.json(threads);
    });
  });
})
.post(function(req, res) {
  // First locates the board by name.
  Board.findOne({ name: req.params.name }, function(err, board) {
    if (err) {
      return res.status(500).json({ message : 'Board could not be retrieved from database.' });
    }
    if (!board) return res.status(404).json({ message: 'Board not found' });
    var thread = new Thread({ title: req.body.title, board: req.params.name});
    thread.save(function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message : 'Internal Server Error' });
      }
      res.location('/threads/' + result._id);
      res.status(201).json(result);
    });
  });
});

module.exports = router;
