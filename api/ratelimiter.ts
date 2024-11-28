import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 1000 * 60 * 60 * 24, // daily
    limit: 25, // max 25 requests per day
    message: "You have the maximum requests per day",
    standardHeaders: true,
    legacyHeaders: true,
})

export default rateLimiter;
