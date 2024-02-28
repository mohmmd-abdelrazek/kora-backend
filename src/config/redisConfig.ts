import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'redis';

const RedisStore = connectRedis(session);

// Configure Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});

redisClient.connect().catch(console.error);

// Configure session with Redis store
export const sessionMiddleware = session({
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

