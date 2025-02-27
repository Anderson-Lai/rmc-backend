/*
import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 1000 * 60 * 60 * 24, // daily
    limit: 24, // max requests per day to prevent malicious actors
    message: "You have the maximum requests per day",
    standardHeaders: true,
    legacyHeaders: true,
});

export default rateLimiter;
*/

// use rate limiter from redis due to serverless vercel functions not storing state

import { Redis } from "@upstash/redis";
import { Request, Response, NextFunction } from "express";

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN
});

export default async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const key = `rate-limit:${ip}`;

    try {
        const requests = await redis.incr(key);

        if (requests === 1) {
          await redis.expire(key, 60 * 60 * 24); // store for 1 day
        }

        if (requests >= 25) {
            res.status(429).json({ error: "Too many requests" });
            return;
        }

        next(); 
    } 
    catch (e) {
        console.error("Rate limiter error:", e);
        res.status(500).json({ error: "Server error" });
    }
};
