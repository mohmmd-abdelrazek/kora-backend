"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const express_session_1 = __importDefault(require("express-session"));
// import { createClient } from "redis";
// import RedisStore from "connect-redis";
// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });
// redisClient.connect().catch(console.error);
// const redisSrore = new RedisStore({ client: redisClient });
exports.sessionMiddleware = (0, express_session_1.default)({
    // store: redisSrore,
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        maxAge: 1000 * 60 * 60,
    },
});
//# sourceMappingURL=redisConfig.js.map