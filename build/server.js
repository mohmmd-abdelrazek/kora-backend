"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const data = {
    "1": ["", "", "", "", ""],
    "2": ["", "", "", "", ""],
    "3": ["", "", "", "", ""],
};
app.get("/retrieve/:sectionId", (req, res) => {
    try {
        const sectionId = req.params.sectionId;
        if (!sectionId) {
            res.status(400).json({ error: "Invalid sectionId" });
            return;
        }
        if (data[sectionId]) {
            res.status(200).json({ data: data[sectionId] });
        }
        else {
            res.status(404).json({ error: "Section not found" });
        }
    }
    catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/submit", (req, res) => {
    try {
        const { sectionId, inputIndex, value } = req.body;
        if (!sectionId || !inputIndex) {
            res.status(400).json({ error: "Invalid input data" });
            return;
        }
        if (!data[sectionId]) {
            res.status(404).json({ error: "Section not found" });
            return;
        }
        data[sectionId][inputIndex] = value;
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Error processing submission:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const users = [
    {
        id: 1,
        username: 'mohamed',
        password: 'asdasd',
    },
];
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (user && user.password === password) {
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, 'secret_key');
        res.json({ token });
    }
    else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
