import express, { Request, Response, Express } from "express";
import dotenv from "dotenv";
dotenv.config();

function main() {
    const app: Express = express();
    const port = Number(process.env.PORT) || 2957;

    app.use(express.json());

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    app.get("/test", (_req: Request, res: Response) => {
        res.status(200).json({
            response: "hello world!"
        });
    });
}

main();
