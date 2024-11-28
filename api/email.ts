import nodemailer from "nodemailer";

class Email {
    public constructor(fromHeading: string, to: string[], subject: string, text: string, 
        username: string, password: string, smtp: string) {
        this._fromHeading = fromHeading;
        this._to = to;
        this._subject = subject;
        this._text = text;
        this._username = username;
        this._password = password;
        this._smtp = smtp; 
    }  

    public async sendEmail(): Promise<boolean> {
        const emailService = nodemailer.createTransport({
            host: this._smtp,
            port: 465,
            logger: true,
            debug: true,
            connectionTimeout: 7500,
            greetingTimeout: 7500,
            auth: {
                user: this._username,
                pass: this._password
            }
        });

        await new Promise((resolve, reject) => {
            emailService.verify((error, success) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return false;
                } 
                else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });

        for (const recipient of this._to) {
            const emailOptions = {
                from: this._fromHeading,
                to: recipient,
                subject: this._subject,
                text: this._text
            };

            await new Promise((resolve, reject) => {
                emailService.sendMail(emailOptions, (err, info) => {
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
            });
        }

        return true;
    }

    private _fromHeading: string;
    private _to: string[];
    private _subject: string;
    private _text: string;
    private _username: string;
    private _password: string;
    private _smtp: string;
}

export default Email;
