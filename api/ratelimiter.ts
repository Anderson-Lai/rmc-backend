import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 1000 * 60 * 60 * 24, // daily
    limit: 24, // max requests per day to prevent malicious actors
    message: "You have the maximum requests per day",
    standardHeaders: true,
    legacyHeaders: true,
});

export default rateLimiter;
