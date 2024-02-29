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
  saveUninitialized: false,
  proxy: true,
  name: "mybestcookie",
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
    maxAge: 1000 * 60 * 60,
  },
});
