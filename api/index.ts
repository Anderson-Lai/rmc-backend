import express from "express";
import dotenv from "dotenv";
dotenv.config();

function main() {
    const app = express();
    const port = Number(process.env.PORT) || 2957;

    app.use(express.json());

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    app.get("/", (_req, res) => {
        res.status(200).json({
            response: "hello world!"
        });
    })
}

main();
