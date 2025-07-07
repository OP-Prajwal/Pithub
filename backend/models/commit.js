const mongoose = require('mongoose');

const commitSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true
  },
  tree: {
    type: String, // hash of tree object
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: String, // ISO format
    required: true
  },
  parent: {
    type: String, // parent commit hash
    default: null
  }
});

module.exports = mongoose.model('Commit', commitSchema);
