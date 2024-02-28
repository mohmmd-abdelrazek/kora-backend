"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
redisClient.connect().catch(console.error);
const redisSrore = new connect_redis_1.default({ client: redisClient });
exports.sessionMiddleware = (0, express_session_1.default)({
    store: redisSrore,
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
});
//# sourceMappingURL=redisConfig.js.map