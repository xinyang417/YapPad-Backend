const express = require("express");
const auth_router = require("./routes/auth");
const DbService = require("./services/db_service")

const app = express();
const PORT = 8000;

app.use(express.json());
app.use("/auth", auth_router);

app.get("/", (req, res) => {
  return res.send("Hello World!");
});

async function main() {
  const db = new DbService()
  db.connect()
    .catch((e) => {
      console.error("An error occured while connecting to mongodb");
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
