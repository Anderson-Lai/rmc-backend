import express from "express";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import rateLimiter from "./ratelimiter";

function main() {
    const app = express();
    const port = Number(process.env.PORT) || 2957;

    // middleware
    app.use(rateLimiter);
    app.use(express.json());

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    app.get("/", (_req, res) => {
        res.status(200).json({
            response: "hello world!"
        });
    });

    app.post("/form", (req, res) => {
        try {
            const { producerEmail, eventName, eventDate, eventSignificance, eventPortrayal, mediaBreakdown } = req.body;
            if (!producerEmail || !eventName || !eventDate || !eventSignificance
                || !eventPortrayal || !mediaBreakdown) {
                res.sendStatus(400);
                return;
            }

            const emailService = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const emailOptions = {
                from: `RMC automatic emailing ${process.env.EMAIL_USERNAME}`,
                to: process.env.EMAIL_RECIPIENT_USERNAME,
                subject: `Pitch Proposal for ${eventName} by ${producerEmail}`,
                text: `A new form submission has been completed on the website with the following details:\n\
                Email of producer: ${producerEmail}\n\
                Name of event: ${eventName}\n\
                Date of event: ${eventDate}\n\
                Event significance: ${eventSignificance}\n\
                Event portrayal: ${eventPortrayal}\n\
                Rough breakdown: ${mediaBreakdown}\n`
            };

            emailService.sendMail(emailOptions, (err, info) => {
                if (err) {
                    console.error(`An error occured during emailing: ${err}`);
                }
                else {
                    console.log(`Email was successfully sent: ${info.response}`);
                }
            })

            res.sendStatus(200);
        }
        catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
}

main();
