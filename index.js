const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔑 Load Firebase Admin Key
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// 🔥 Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://home-a2c3c-default-rtdb.firebaseio.com/"
});

const db = admin.database();

// ✅ Test route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// ✅ Turn ON
// TURN ON
app.get("/device/light1/on", async (req, res) => {
    await db.ref("devices/light1").update({ state: true });
    res.send("Light ON");
});

// TURN OFF
app.get("/device/light1/off", async (req, res) => {
    await db.ref("devices/light1").update({ state: false });
    res.send("Light OFF");
});

// ✅ Generic route (better)
app.post("/alexa", async (req, res) => {

    const intent = req.body.request.intent?.name;

    if (intent === "TurnOnLightIntent") {
        await db.ref("devices/light1").update({ state: true });

        return res.json({
            version: "1.0",
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: "Light turned on"
                },
                shouldEndSession: true
            }
        });
    }

    if (intent === "TurnOffLightIntent") {
        await db.ref("devices/light1").update({ state: false });

        return res.json({
            version: "1.0",
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: "Light turned off"
                },
                shouldEndSession: true
            }
        });
    }
});

// 🚀 Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});