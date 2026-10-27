const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Equipment = require('./models/Equipment'); // Your blueprint

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Database'))
    .catch((err) => console.log('Database connection error:', err));

// 1. CREATE (POST)
app.post('/api/equipment', async (req, res) => {
    try {
        const newEquipment = new Equipment(req.body);
        const savedEquipment = await newEquipment.save();
        res.status(201).json(savedEquipment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 2. READ (GET)
app.get('/api/equipment', async (req, res) => {
    try {
        const equipmentList = await Equipment.find();
        res.status(200).json(equipmentList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE (PUT)
app.put('/api/equipment/:id', async (req, res) => {
    try {
        const updatedEquipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedEquipment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. DELETE
app.delete('/api/equipment/:id', async (req, res) => {
    try {
        await Equipment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Equipment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});