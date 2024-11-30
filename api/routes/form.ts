import { Request, Response } from "express";
import { isValidEmail } from "../validate";
import Email from "../email";

export default async function form(req: Request, res: Response) {
    try {
        const { producerEmail, eventName, eventDate, eventSignificance, 
            eventPortrayal, mediaBreakdown, producerName } = req.body;

        if (!producerEmail || !isValidEmail(producerEmail) || !eventName || !eventDate 
            || !eventSignificance || !eventPortrayal || !mediaBreakdown || !producerName) {
            res.sendStatus(400);
            return;
        }

        const emailAddress = process.env.EMAIL_ADDRESS || "";
        const password = process.env.EMAIL_PASSWORD || "";
        const smtp = "smtp.gmail.com";

        const recipient = process.env.EMAIL_RECIPIENT_ADDRESS || "";

        const fromHeading = `RMC Automatic Emailing <${emailAddress}>`;
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

        const emailer = new Email(emailAddress, password, smtp);
        if (!await emailer.sendEmail(fromHeading, recipients, subject, text,)) {
            throw new Error("An error occurred while emailing.");
        }

        res.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}