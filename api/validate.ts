

// ensure the email is a valid @ycdsbk12.ca email
export function isValidEmail(email: string): boolean {
    return email.split("@").pop() === "ycdsbk12.ca" && email.trim() !== "anderson.lai26@ycdsbk12.ca";
}
