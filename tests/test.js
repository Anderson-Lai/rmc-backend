async function testEmailing() {
    try {
        const response = await fetch("http://localhost:3000/form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                producerEmail: "andersonmhlai26@gmail.com",
                eventName: "going to school!",
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
    catch (e) {
        console.error(e);
    }
}

async function main() {
    await testEmailing();
}

main();
