const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  commits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commit'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Repo', repoSchema);
