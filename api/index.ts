import express from "express";
import dotenv from "dotenv";
dotenv.config();
import rateLimiter from "./ratelimiter";
import cors from "cors";
import form from "./endpoints/form";
import root from "./endpoints/root";

function main() {
    const app = express();
    const port = Number(process.env.PORT) || 2957;

    // middleware
    app.set("trust proxy", 1); // trust vercel
    app.use(cors());
    app.use(express.json());

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    app.get("/", root);
    app.post("/form", rateLimiter, form);
}

main();
