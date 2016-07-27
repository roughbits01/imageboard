exports.create = function(user, text, done) {
  // Creates the thread with the text and calls 'done(null, id)'
}

exports.getAll = function(done) {
  // Finds all threads and calls 'done(null, threads)'
}

exports.getAllByUser = function(user, done) {
  // Finds all threads by user and calls 'done(null, threads)'
}

exports.recentlyViewedThreads = function(user, done) {
  // Finds recently viewed threads by user and calls 'done(null, threads)'
}

exports.currentViewerCount = function(thread, done) {
  // Number of logged-in users viewing this thread in the past 15 minutes 'done(null, count)'
}
