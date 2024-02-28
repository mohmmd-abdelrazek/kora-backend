"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_1 = __importDefault(require("redis"));
const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
// Configure Redis client
const redisClient = redis_1.default.createClient({
    url: process.env.REDIS_URL,
    legacyMode: true,
});
redisClient.connect().catch(console.error);
// Configure session with Redis store
exports.sessionMiddleware = (0, express_session_1.default)({
    store: new RedisStore({ client: redisClient }),
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