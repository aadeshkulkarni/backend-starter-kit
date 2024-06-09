import express from "express";
import { createClient } from "redis";

const PORT = process.env.PORT || 3000;
const client = createClient();
const app = express();
app.use(express.json());

app.post("/submit", async (req, res) => {
  const { problemId, userId, code, language } = req.body;
  // Push to DB
  try {
    await client.lPush("submissions", JSON.stringify({ problemId, userId, code, language }));
    res.json({
      message: "Submission received!",
    });
  } catch (ex) {
    res.json({
      error: "Error",
      stackTrace: ex,
    });
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to Redis");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect to Redis, ", error);
  }
}

startServer();
