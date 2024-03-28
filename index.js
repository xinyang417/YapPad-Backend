const express = require("express");
const auth_router = require("./routes/auth_route.js");
const DbService = require("./services/db_service.js");

const app = express();
const PORT = 8000;

// Enable CORS for all routes
const cors = require("cors");
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Define routes
app.use("/auth", auth_router);

// Additional CORS configuration if needed
app.use(cors({
  origin: 'http://localhost:5173/' // Allow requests from this origin only
}));

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