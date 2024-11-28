async function testEmailing() {
    const ITERATIONS = 1;
    try {
        for (let i = 0; i < ITERATIONS; i++) {
            const response = await fetch("https://rmc-backend.vercel.app/form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    producerEmail: "andersonmhlai26@gmail.com",
                    eventName: "testing automatic emailing on vercel deployment",
                    eventDate: "today",
                    eventSignificance: "i get to learn",
                    eventPortrayal: "i will be recording a titration lab in class",
                    mediaBreakdown: "add 0.5M barium hydroxide to HCl"
                })
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
