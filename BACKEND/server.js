import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "works" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "api works" });
});

app.use("/api/auth", authRouter);

app.listen(process.env.PORT || 5002, () => {
  console.log("Server running");
});
