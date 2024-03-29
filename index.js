const express = require("express");
const auth_router = require("./routes/auth_route.js");
const yap_router = require("./routes/yap_route.js");
const DbService = require("./services/db_service.js");
const session = require("express-session");

const app = express();
const PORT = 8000;

// Enable CORS for all routes
const cors = require("cors");

// Parse JSON requests
app.use(express.json());

// Define routes
app.use(session({
  secret: 'keyboardcat',
  resave: 'false',
  saveUninitialized: false,
  // cookie: { secure: true }
}));

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true // Allow credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Define your routes
app.use("/auth", auth_router);
app.use("/yaps", yap_router);

// Handle preflight requests
app.options('*', cors(corsOptions));

app.get("/", (req, res) => {
  return res.send("Hello World!");
});

async function main() {
  const db = new DbService();
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`Started listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("An error occurred while connecting to MongoDB");
    console.error(error);
    process.exit(1);
  }
}

main();
