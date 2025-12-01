// routes/electionRoutes.js
import express from "express";
import Election from "../models/Election.js";
import User from "../models/User.js";
import { getAuth } from "@clerk/express";

const router = express.Router();

// Helper: Get current user + check if admin
const getCurrentUser = async (req) => {
  const auth = req.auth(); // ← CALL AS FUNCTION
  const userId = auth?.userId;

  if (!userId) throw new Error("Unauthorized");

  const user = await User.findOne({ clerkId: userId });
  if (!user) throw new Error("User not found in DB – sync first");

  return user;
};

// ========== ADMIN ONLY: Create Election ==========
router.post("/", async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create elections" });
    }

    const { title, region, startDate, endDate } = req.body;

const election = new Election({
      title,
      region,
      startDate: new Date(startDate),   // convert string → Date
      endDate: new Date(endDate),       // convert string → Date
      createdBy: currentUser.clerkId,
      createdByName: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "Admin",
    });

    await election.save();
    res.status(201).json(election);
  } catch (error) {
    console.error("Election creation error:", error);   
    res.status(400).json({ message: error.message });
  }
});

// ========== ADMIN ONLY: Add Candidate ==========
router.post("/:id/candidates", async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: "Election not found" });

    const { name, party } = req.body;
    election.candidates.push({ name, party });
    await election.save();

    res.json(election);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ========== ADMIN ONLY: Declare Winner ==========
router.put("/:id/declare-winner", async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    if (currentUser.role !== "admin") return res.status(403).json({ message: "Admin only" });

    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: "Election not found" });

    const { winnerName } = req.body;
    election.status = "completed";
    election.winner = winnerName;
    await election.save();

    res.json(election);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ========== PUBLIC: Get all elections ==========
router.get("/", async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== PUBLIC: Get single election ==========
router.get("/:id", async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: "Not found" });
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ===================== EDIT ELECTION =====================
router.put("/:id", async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (user.role !== "admin") return res.status(403).json({ message: "Admin only" });

    const { title, region, startDate, endDate } = req.body;
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      {
        title,
        region,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      { new: true, runValidators: true }
    );

    if (!election) return res.status(404).json({ message: "Election not found" });
    res.json(election);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ===================== DELETE ELECTION =====================
router.delete("/:id", async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (user.role !== "admin") return res.status(403).json({ message: "Admin only" });

    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) return res.status(404).json({ message: "Election not found" });

    res.json({ message: "Election deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===================== EDIT CANDIDATE =====================
router.put("/:electionId/candidates/:candidateId", async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (user.role !== "admin") return res.status(403).json({ message: "Admin only" });

    const election = await Election.findById(req.params.electionId);
    if (!election) return res.status(404).json({ message: "Election not found" });

    const candidate = election.candidates.id(req.params.candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    Object.assign(candidate, req.body);
    await election.save();

    res.json(election);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:electionId/candidates/:candidateId", async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (user.role !== "admin") return res.status(403).json({ message: "Admin only" });

    const election = await Election.findById(req.params.electionId);
    if (!election) return res.status(404).json({ message: "Election not found" });

    // THIS IS THE FIX
    election.candidates.pull(req.params.candidateId);
    await election.save();

    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    console.error("Delete candidate error:", err.message);
    res.status(500).json({ message: err.message });
  }
});
export default router;