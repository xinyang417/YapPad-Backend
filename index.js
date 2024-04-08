const express = require("express");
const cors = require("cors");
const auth_router = require("./routes/auth_route.js");
const yap_router = require("./routes/yap_route.js");
const admin_router = require("./routes/admin_route.js");
const DbService = require("./services/db_service.js");
const session = require("express-session");
var MongoDBStore = require('connect-mongodb-session')(session);

const dotenv = require('dotenv')
dotenv.config()

var store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

const app = express();
const PORT = 8000;

// Enable CORS for all routes
// Additional CORS configuration if needed
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow requests from this origin only
    credentials: true
  })
);

// Parse JSON requests
app.use(express.json());

// Define routes
app.use(
  session({
    secret: "keyboardcat",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: "false",
    saveUninitialized: false,
    // cookie: { secure: true }
  })
);

const v1 = express.Router()
v1.use("/auth", auth_router);
v1.use("/yaps", yap_router);
v1.use("/admin", admin_router);

app.use("/v1", v1)

app.get("/", (req, res) => {
  return res.send("Hello World!");
});

async function main() {
  const db = new DbService();
  db.connect()
    .catch((e) => {
      console.error("An error occurred while connecting to MongoDB");
      console.error(e);
      process.exit(1);
    })
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Started listening on port ${PORT}`);
      });
    });
}

main();
