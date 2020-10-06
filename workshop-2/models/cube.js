const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageURL: String,
  difficultyLevel: Number,
  accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'accessory' }]
});

module.exports = new mongoose.model('cube', cubeSchema);
