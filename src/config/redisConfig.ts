import session from "express-session";
// import { createClient } from "redis";
// import RedisStore from "connect-redis";

// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });
// redisClient.connect().catch(console.error);

// const redisSrore = new RedisStore({ client: redisClient });

export const sessionMiddleware = session({
  // store: redisSrore,
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: "none"
  },
});
