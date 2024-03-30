const express = require("express");
const cors = require("cors");
const auth_router = require("./routes/auth_route.js");
const yap_router = require("./routes/yap_route.js");
const admin_router = require("./routes/admin_route.js");
const DbService = require("./services/db_service.js");
const session = require("express-session");

const app = express();
const PORT = 8000;

// Enable CORS for all routes
// Additional CORS configuration if needed
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin only
    credentials: true
  })
);

// Parse JSON requests
app.use(express.json());

// Define routes
app.use(
  session({
    secret: "keyboardcat",
    resave: "false",
    saveUninitialized: false,
    // cookie: { secure: true }
  })
);
app.use("/auth", auth_router);
app.use("/yaps", yap_router);
app.use("/admin", admin_router);

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