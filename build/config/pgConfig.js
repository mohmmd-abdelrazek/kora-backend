"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}
const pool = new pg_1.Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === "production" ? {
        rejectUnauthorized: false
    } : false
});
exports.default = pool;
//# sourceMappingURL=pgConfig.js.map