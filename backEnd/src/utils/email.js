import "dotenv/config";

// Added fromName as an optional parameter (defaults to "sMv|Blog")
export const Email = async (email, subject, message, fromName = "sMv|Blog") => {
    const googleScriptUrl = process.env.GAS_WEB_APP_URL;
    const authToken = process.env.GAS_AUTH_TOKEN;

    if (!googleScriptUrl || !authToken) {
        throw new Error("Missing GAS_WEB_APP_URL or GAS_AUTH_TOKEN in environment variables.");
    }

    try {
        const response = await fetch(googleScriptUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: authToken,
                to: email,
                subject: subject,
                body: message,
                fromName: fromName // <-- Pass the display name to Google
            }),
        });

        const responseText = await response.text();

        if (responseText.trim().startsWith("<!DOCTYPE")) {
            throw new Error("Google Apps Script returned HTML. Check permissions.");
        }

        const result = JSON.parse(responseText);

        if (result.status !== "success") {
            throw new Error(`Google Apps Script Error: ${result.message}`);
        }
        
    } catch (error) {
        console.error("Failed to send email via Google Apps Script:", error);
        throw error;
    }
};

export default Email;
