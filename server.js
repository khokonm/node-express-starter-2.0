const path = require("path");
const { app, server, express, handle } = require("./app");

// register the folder alias
require('module-alias/register');

const db = require("./services/db.service");

const routes = require("./routes");

// app config
const PORT = process.env.PORT || 8000;
const BASE_PATH = process.env.BASE_PATH || ''; // set base path if project is hosted on path other than root

// public folder
app.use(express.static(path.join(__dirname, "public")));

// events
// uncomment to send emails
// require("./services/event.service");
// require("./events");

// if using react app
// app.use(express.static(path.join(__dirname, "client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
// });

app.use(BASE_PATH, routes);

const syncConfig = {
    // logging: true,
    logging: false,
    alter: true,
    // force: true,
};

db.connect
    .sync(syncConfig)
    .then(() => {
        console.log("\nDatabase connection established");
    })
    .catch((error) => {
        console.log(error);
        console.log("Database connection failed");
        process.exit(1);
    });



server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server ready on http://localhost:${PORT}`);
});