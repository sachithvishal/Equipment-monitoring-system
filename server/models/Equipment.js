const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    equipmentName: { type: String, required: true },
    status: { type: String, required: true },
    technician: { type: String, required: true },
    lastServiced: { type: Date, default: Date.now },
    notes: { type: String }
});

module.exports = mongoose.model('Equipment', equipmentSchema);