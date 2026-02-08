// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./config/db.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import resultsRouter from "./routes/results.js";
import userRoutes from "./routes/userRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";

dotenv.config();

const app = express();

// Safety checks
if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
  console.error("❌ Missing Clerk keys");
  process.exit(1);
}

/* -------------------- CORS FIRST -------------------- */
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------- BODY PARSER -------------------- */
app.use(express.json());

/* -------------------- CLERK AUTH -------------------- */
app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  })
);

/* -------------------- DB -------------------- */
await connectDB();

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});


/* -------------------- ROUTES -------------------- */
app.use("/api/users", userRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/results", resultsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Maharashtra Voting System API – Clerk Ready!" });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
