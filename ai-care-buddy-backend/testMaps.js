const axios = require('axios');

async function testMaps() {
    try {
        const apiKey = "AIzaSyAylGXDbV4mBUCvsajflPlq12IKu4Am3-I";
        const location = "37.7749,-122.4194";
        const radius = 5000;
        const type = "hospital";

        console.log(`[TEST] Testing Google Places API with key: ${apiKey.substring(0, 8)}...`);
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;

        const response = await axios.get(url);
        console.log("[RESULT SUCCESS] Status Code:", response.status);
        console.log("[RESULT SUCCESS] Total Results:", response.data.results.length);

        if (response.data.error_message) {
            console.error("[GOOGLE ERROR]", response.data.error_message);
        }

    } catch (err) {
        console.error("[RESULT FAILED] Axios Error:", err.message);
        if (err.response) {
            console.error("[RESULT FAILED] Error Data:", err.response.data);
        }
    }
}

testMaps();
