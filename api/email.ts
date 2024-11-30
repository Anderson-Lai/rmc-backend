import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default class Email {
    public constructor(emailAddress: string, password: string, smtp: string) {
        this._emailAddress = emailAddress;
        this._password = password;
        this._smtp = smtp;
    }

    public async sendEmail(fromHeading: string, recipients: string[],
        subject: string, text: string) {

        const transporter = this.createTransporter();
        if (!this.verifyServer(transporter)) {
            console.error(`Could not connect to ${this._smtp}. Emailing will not continue.`);
            return false;
        }

        // start emailing all the recipients and
        // gather the promises in an array
        const promises = [];
        for (const recipient of recipients) {
            const emailOptions = {
                from: fromHeading,
                to: recipient,
                subject: subject,
                text: text
            };

            promises.push(new Promise((resolve, reject) => {
                transporter.sendMail(emailOptions, (err, info) => {
                    if (err) {
                        console.error(`An error occured during emailing: ${err}`);
                        reject(err);
                        return false;
                    }
                    else {
                        console.log(`Email was successfully sent: ${info.response}`);
                        resolve(info); 
                    }
                });
            }));
        }

        // await all the emails in progress concurrently
        try {
            await Promise.all(promises);
        }
        catch (e) {
            console.error(e);
            return false;
        }

        return true;
    }

    private createTransporter() {
        return nodemailer.createTransport({
            host: this._smtp,
            port: 465,
            logger: true,
            debug: true,
            connectionTimeout: 7500,
            greetingTimeout: 7500,
            auth: {
                user: this._emailAddress,
                pass: this._password
            }
        });
    }

    private async verifyServer(transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>): Promise<boolean> {
        try {
            await new Promise((resolve, reject) => {
                transporter.verify((error, success) => {
                    if (error) {
                        reject(error);
                    }
                    
                    console.log("Server is ready to take receive an email.");
                    resolve(success);
                })
            });
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }

    private _emailAddress: string;
    private _password: string;
    private _smtp: string;
}