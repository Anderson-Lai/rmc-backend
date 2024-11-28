const URL = "http://localhost:3000/form";
const DATA = {
    producerEmail: "andersonmhlai26@gmail.com",
    eventName: "going to school!",
    eventDate: "today",
    eventSignificance: "i get to learn",
    eventPortrayal: "i will be recording a titration lab in class",
    mediaBreakdown: "add 0.5M barium hydroxide to HCl"
};
const HEADER = {
    "Content-Type": "application/json"
}

async function testEmailing() {
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: HEADER,
            body: JSON.stringify(DATA)
        });

        if (!response.ok) {
            throw new Error(`Non-ok status code ${response.status}`);
        }
        else {
            console.log(`Email successfully sent; status code: ${response.status}`);
        }
    }
    catch (e) {
        console.error(e);
    }
}

async function testRateLimit() {
    for (let i = 0; i < 50; i++) {
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: HEADER, 
                body: JSON.stringify(DATA)
            });

            if (!response.ok) {
                throw new Error(`Non-ok status code ${response.status}`);
            }
            else {
                console.log(`Email successfully sent; status code: ${response.status}`);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}

async function main() {
    await testEmailing();
    //await testRateLimit();
}

main();
