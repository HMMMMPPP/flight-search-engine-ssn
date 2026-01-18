
async function debugAI() {
    console.log("🔍 Testing AI Command Endpoint...");
    try {
        const res = await fetch('http://localhost:3000/api/ai-command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: "Find me a cheap flight",
                context: { avgPrice: 500, count: 10 }
            })
        });

        const status = res.status;
        const data = await res.json();

        console.log(`Response Status: ${status}`);
        console.log("Response Body:", JSON.stringify(data, null, 2));

    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

debugAI();
