var express = require('express');
var router = express.Router();

//GET /tags

router.route('/')
.get(function(req, res) {
  res.json();
})

module.exports = router;
