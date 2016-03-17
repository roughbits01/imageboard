var express = require('express');
var router = express.Router();

//GET /stats

router.route('/')
.get(function(req, res) {
  res.json({
    posts: {
      active: 200000,
      total: 10000000
    },
    users: {
      active: 2000,
      total: 100000
    },
    servers: [
      { name: 'users', status: 'UP' },
      { name: 'posts', status: 'UP' },
      { name: 'upload', status: 'UP' },
      { name: 'authentication', status: 'UP' }
    ]
  });
})

module.exports = router;
