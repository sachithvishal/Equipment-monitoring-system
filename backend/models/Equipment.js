const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  equipmentName: { type: String, required: true },
  status: { type: String, required: true },
  condition: { type: String, default: 'Good' },
  technician: { type: String, required: true },
  details: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', EquipmentSchema);