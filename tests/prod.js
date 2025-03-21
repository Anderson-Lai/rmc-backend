const ITERATIONS = 50;
const URL = "https://rmc-backend.vercel.app/form";
const HEADER = {
    "Content-Type": "application/json"
};
const DATA = {
    producerName: "Anderson Lai",
    producerEmail: "anderson.lai26@ycdsbk12.ca",
    eventName: "testing automatic emailing on vercel deployment",
    eventDate: "today",
    eventSignificance: "i get to learn",
    eventPortrayal: "i will be recording a titration lab in class",
    mediaBreakdown: "add 0.5M barium hydroxide to HCl"
}

async function testEmailing() {
    try {
        for (let i = 0; i < ITERATIONS; i++) {
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
    }
    catch (e) {
        console.error(e);
    }
}

testEmailing();
