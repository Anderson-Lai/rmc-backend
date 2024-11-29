import express from "express";
import dotenv from "dotenv";
dotenv.config();
import rateLimiter from "./ratelimiter";
import Email from "./email";
import { isValidEmail } from "./validate";
import cors from "cors";

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

    app.get("/", (_req, res) => {
        res.status(200).json({
            response: "hello world!"
        });
    });

    app.post("/form", rateLimiter, async (req, res) => {
        try {
            const { producerEmail, eventName, eventDate, 
                eventSignificance, eventPortrayal, mediaBreakdown, producerName } = req.body;

            if (!producerEmail || !isValidEmail(producerEmail) || !eventName || !eventDate || !eventSignificance
                || !eventPortrayal || !mediaBreakdown || !producerName) {
                res.sendStatus(400);
                return;
            }

            const username = process.env.EMAIL_USERNAME || "";
            const password = process.env.EMAIL_PASSWORD || "";
            const recipient = process.env.EMAIL_RECIPIENT_USERNAME || "";

            const fromHeading = `RMC Automatic Emailing <${username}>`;
            const recipients = [recipient];
            const subject = `New Pitch Proposal for '${eventName}' by ${producerName}`;

            const text = `A new pitch proposal has been completed on the website with the following details:\n\n` + 
                `Name of producer:\n${producerName}\n\n` + 
                `Email of producer:\n${producerEmail}\n\n` +
                `Name of event:\n${eventName}\n\n` + 
                `Date of event:\n${eventDate}\n\n` +
                `Event significance:\n${eventSignificance}\n\n` +
                `Event portrayal:\n${eventPortrayal}\n\n` +
                `Rough breakdown:\n${mediaBreakdown}\n\n`;

            const smtp = "smtp.gmail.com";

            const emailer = new Email(fromHeading, recipients, subject, text, username, password, smtp);
            await emailer.sendEmail();

            res.sendStatus(200);
        }
        catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
}

main();
