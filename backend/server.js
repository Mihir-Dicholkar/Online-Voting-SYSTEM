// backend/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import resultsRouter from "./routes/results.js";
import userRoutes from "./routes/userRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";

dotenv.config();

const app = express();

// Safety checks for keys
if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
  console.error("Missing CLERK_SECRET_KEY or CLERK_PUBLISHABLE_KEY in .env!");
  process.exit(1);
}

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(express.json());

// Pass both keys explicitly
app.use(clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
}));

app.use((err, req, res, next) => {
  if (err.status === 401) {
    return res.status(401).json({ success: false, message: "Unauthorized – please sign in" });
  }
  next(err);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

app.use("/api/users", userRoutes);
  app.use("/api/elections", electionRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/results", resultsRouter);
app.get("/", (req, res) => {
  res.json({ message: "Maharashtra Voting System API – Clerk Ready!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});