const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Online VAPID keys generator https://vapidkeys.com/
const SUBJECT = "mailto:vapidsample2@mailinator.com";
const PUBLIC_VAPID_KEY = "BHDjmLxkGF1mY8khb3QqJV-0AjITKTF27B5ORHfMcTvWYMSuRMSKkDUo0pK8X0KejNvvrGN5CMSIht_VOtUh7h8";
const PRIVATE_VAPID_KEY = "bgcEl99dykDrEXTZ4hQyw6HZvtzpP0H4NdVZ-3RrYL4";

webPush.setVapidDetails(SUBJECT, PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);


let subscriptions = [];

app.post("/subscribe", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);

    console.log("new subscription", subscriptions.length, req.body);

    res.status(201).json({});
});

app.post("/send-notification", (req, res) => {
    const { message } = req.body;

    console.log("req.body", req.body)

    const date = new Date();
    const payload = JSON.stringify({
        title: "Send: " + date.toLocaleTimeString(),
        body: message,
    });

    subscriptions.forEach(subscription => {
        // setTimeout(() => {
            webPush.sendNotification(subscription, payload).catch(error => {
                console.log("---catch---");
                console.error(JSON.stringify(error));
                console.error(error.stack);
            });
        // }, 5000)
    });

    res.status(200).json({});
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
