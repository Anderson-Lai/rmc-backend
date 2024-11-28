import express from "express";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import rateLimiter from "./ratelimiter";

function main() {
    const app = express();
    const port = Number(process.env.PORT) || 2957;

    // middleware
    app.set("trust proxy", 1); // trust vercel
    app.use(express.json());

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    app.get("/", (_req, res) => {
        res.status(200).json({
            response: "hello world!"
        });
    });

    app.post("/form", rateLimiter, async (req, res) => {
        try {
            const { producerEmail, eventName, eventDate, eventSignificance, eventPortrayal, mediaBreakdown } = req.body;
            if (!producerEmail || !eventName || !eventDate || !eventSignificance
                || !eventPortrayal || !mediaBreakdown) {
                res.sendStatus(400);
                return;
            }

            const emailService = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                logger: true,
                debug: true,
                connectionTimeout: 7500,
                greetingTimeout: 7500,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            await new Promise((resolve, reject) => {
                // verify connection configuration
                emailService.verify((error, success) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        console.log("Server is ready to take our messages");
                        resolve(success);
                    }
                });
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

            await new Promise((resolve, reject) => {
                emailService.sendMail(emailOptions, (err, info) => {
                    if (err) {
                        console.error(`An error occured during emailing: ${err}`);
                        reject(err);
                    }
                    else {
                        console.log(`Email was successfully sent: ${info.response}`);
                        resolve(info); 
                    }
                })
            });

            res.sendStatus(200);
        }
        catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
}

main();
