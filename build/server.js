"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const data = {
    '1': ['', '', '', '', ''],
    '2': ['', '', '', '', ''],
    '3': ['', '', '', '', '']
};
app.get('/retrieve/:sectionId', (req, res) => {
    const sectionId = req.params.sectionId;
    if (data[sectionId]) {
        res.status(200).json({ data: data[sectionId] });
    }
    else {
        res.status(404).json({ error: 'Section not found' });
    }
});
app.post('/submit', (req, res) => {
    try {
        const { sectionId, inputIndex, value } = req.body;
        data[sectionId][inputIndex] = value;
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
