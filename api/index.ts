import express from "express";
import dotenv from "dotenv";
dotenv.config();
import rateLimiter from "./ratelimiter";
import Email from "./email";

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

            const emailer = new Email(`RMC Automatic Emailing <${process.env.EMAIL_USERNAME}`,
                [process.env.EMAIL_RECIPIENT_USERNAME || ""],
                `Pitch Proposal for '${eventName}' by ${producerEmail}`,
                `A new form submission has been completed on the website with the following details:\n\
                Email of producer: ${producerEmail}\n\
                Name of event: ${eventName}\n\
                Date of event: ${eventDate}\n\
                Event significance: ${eventSignificance}\n\
                Event portrayal: ${eventPortrayal}\n\
                Rough breakdown: ${mediaBreakdown}\n`,
                process.env.EMAIL_USERNAME || "",
                process.env.EMAIL_PASSWORD || "",
                "smtp.gmail.com"
            )

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
