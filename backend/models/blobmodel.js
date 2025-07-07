const mongoose = require('mongoose');

const blobSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String, // 'blob', 'tree', or 'commit'
    enum: ['blob', 'tree', 'commit'],
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Blob', blobSchema);
