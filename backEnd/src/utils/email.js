import "dotenv/config";
import axios from "axios";

export const Email = async (email, subject, message, fromName = "sMv|Blog") => {
    console.log("We are here chat - execution starting");
    
    const googleScriptUrl = process.env.GAS_WEB_APP_URL;
    const authToken = process.env.GAS_AUTH_TOKEN;

    if (!googleScriptUrl || !authToken) {
        throw new Error("Missing GAS_WEB_APP_URL or GAS_AUTH_TOKEN in environment variables.");
    }

    try {
        // Axios cleanly follows the 302 redirects Google Apps Script uses
        const response = await axios.post(googleScriptUrl, {
            token: authToken,
            to: email,
            subject: subject,
            body: message,
            fromName: fromName
        }, {
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 10000 // 10 second timeout preventing infinite hangs
        });

        const result = response.data;

        if (typeof result === 'string' && result.trim().startsWith("<!DOCTYPE")) {
            throw new Error("Google Apps Script returned HTML configuration instead of JSON. Check deployment deployment permissions.");
        }

        if (result.status !== "success") {
            console.log(`Google Apps Script Error: ${result.message}`);
            throw new Error(`Google Apps Script Error: ${result.message}`);
        }
        
        console.log("Email sent successfully via GAS");
        return true;
        
    } catch (error) {
        console.error("Failed to send email via Google Apps Script:", error.message);
        // Rethrow an explicit error so your express error handler catch block handles it gracefully
        throw new Error(`Email delivery system failed: ${error.message}`);
    }
};

export default Email;
