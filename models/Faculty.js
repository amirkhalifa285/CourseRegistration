const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true }
});

module.exports = mongoose.model('Faculty', facultySchema);
