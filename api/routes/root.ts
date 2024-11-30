import { Request, Response } from "express";

export default function root(_req: Request, res: Response) {
    res.status(200).json({
        response: "hello world!"
    });
}