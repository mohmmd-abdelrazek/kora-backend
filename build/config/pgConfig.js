"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create a new pool instance, which will manage multiple client connections to the PostgreSQL server.
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL, // Connection string from environment variable
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // For Heroku or other cloud providers, if needed
});
exports.default = pool;
//# sourceMappingURL=pgConfig.js.map