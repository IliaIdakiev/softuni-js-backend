const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const accessorySchema = new mongoose.Schema({
  name: String,
  description: String,
  imageURL: String,
  cubes: [{ type: Types.ObjectId, ref: 'cube' }]
});

module.exports = new mongoose.model('accessory', accessorySchema);
