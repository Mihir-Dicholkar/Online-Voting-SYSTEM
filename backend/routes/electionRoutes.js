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


// ========== PUBLIC: Get all LIVE elections with vote counts ==========
router.get("/live", async (req, res) => {
  const now = new Date();
  console.log("LIVE elections check at:", now);

  const elections = await Election.find({
    status: "active",
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  console.log("Live elections found:", elections.length);
  res.json(elections);
});



// ========== ADMIN ONLY: Create Election ==========
router.post("/", async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    if (currentUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create elections" });
    }

    const { title, region, startDate, endDate } = req.body;

    const election = new Election({
      title,
      region,
      startDate: new Date(startDate), // convert string → Date
      endDate: new Date(endDate), // convert string → Date
      createdBy: currentUser.clerkId,
      createdByName:
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
        "Admin",
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
    if (!election)
      return res.status(404).json({ message: "Election not found" });

    const { name, party } = req.body;
    election.candidates.push({ name, party });
    await election.save();

    if (!name || !party) {
  return res.status(400).json({ message: "Name and party required" });
}

    res.json(election);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ========== ADMIN ONLY: Declare Winner ==========
router.put("/:id/declare-winner", async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    if (currentUser.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const election = await Election.findById(req.params.id);
    if (!election)
      return res.status(404).json({ message: "Election not found" });

    const candidateExists = election.candidates.some(
  c => c.name === winnerName
);

if (!candidateExists) {
  return res.status(400).json({ message: "Invalid winner" });
}


    const { winnerName } = req.body;
    election.status = "completed";
    election.winner = winnerName;
    await election.save();

    res.json(election);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




// ========== VOTER: Get active election for my region ==========
router.get("/my-election", async (req, res) => {
  try {
    console.log("GET /api/elections/my-election called");
    const currentUser = await getCurrentUser(req);
    console.log("Current user:", {
      id: currentUser._id,
      district: currentUser.district,
      role: currentUser.role,
      profileCompleted: currentUser.profileCompleted,
      hasVoted: currentUser.hasVoted,
    });

    const now = new Date();
    console.log("Current time:", now);

    const election = await Election.findOne({
      region: currentUser.district,
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: "active",
    });

    console.log(
      "Found election for district:",
      currentUser.district,
      election ? "YES" : "NO"
    );
    if (election) {
      console.log("Election details:", {
        title: election.title,
        region: election.region,
        status: election.status,
        start: election.startDate,
        end: election.endDate,
      });
    }
    if (!election) {
      return res.json(null);
    }

    res.json(election);

    // ... rest of your code
  } catch (error) {
    console.error("/my-election error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ========== PUBLIC: Get all elections ==========
// At the very top of electionRoutes.js
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/elections called");
    console.log("Clerk user ID from token:", req.auth?.userId);

    const elections = await Election.find().sort({ createdAt: -1 });
    console.log("Total elections in DB:", elections.length);
    console.log(
      "Elections data:",
      elections.map((e) => ({
        id: e._id,
        title: e.title,
        region: e.region,
        status: e.status,
        startDate: e.startDate,
        endDate: e.endDate,
        candidatesCount: e.candidates.length,
      }))
    );

    res.json(elections);
  } catch (error) {
    console.error("Error in GET /api/elections:", error);
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
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

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

    if (!election)
      return res.status(404).json({ message: "Election not found" });
    res.json(election);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ===================== DELETE ELECTION =====================
router.delete("/:id", async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election)
      return res.status(404).json({ message: "Election not found" });

    res.json({ message: "Election deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===================== EDIT CANDIDATE =====================
router.put("/:electionId/candidates/:candidateId", async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const election = await Election.findById(req.params.electionId);
    if (!election)
      return res.status(404).json({ message: "Election not found" });

    const candidate = election.candidates.id(req.params.candidateId);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

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
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const election = await Election.findById(req.params.electionId);
    if (!election)
      return res.status(404).json({ message: "Election not found" });

    // THIS IS THE FIX
    election.candidates.pull(req.params.candidateId);
    await election.save();

    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    console.error("Delete candidate error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ========== VOTER: Cast Vote ==========
// Add this route (you already have most of it)
router.post("/:electionId/vote", async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    if (currentUser.role !== "voter")
      return res.status(403).json({ message: "Voters only" });
    if (!currentUser.profileCompleted)
      return res.status(403).json({ message: "Complete profile" });

    const election = await Election.findById(req.params.electionId);
    if (
      !election ||
      election.region !== currentUser.district ||
      election.status !== "active"
    )
      return res.status(400).json({ message: "Cannot vote in this election" });

    if (currentUser.hasVoted)
      return res.status(400).json({ message: "Already voted" });

    const candidate = election.candidates.id(req.body.candidateId);
    if (!candidate)
      return res.status(400).json({ message: "Invalid candidate" });

    candidate.votes += 1;
    currentUser.hasVoted = true;
    currentUser.votedInElection = election._id;
    await Promise.all([election.save(), currentUser.save()]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD THIS ROUTE (Admin only - Activate Election)
router.put("/:id/activate", async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    if (currentUser.role !== "admin")
      return res
        .status(403)
        .json({ message: "Only admins can activate elections" });

    const election = await Election.findById(req.params.id);
    if (!election)
      return res.status(404).json({ message: "Election not found" });

    election.status = "active";
    await election.save();

    console.log(
      `Election "${election.title}" activated by admin ${currentUser.fullName}`
    );
    res.json({ message: "Election activated!", election });
  } catch (err) {
    console.error("Activate error:", err);
    res.status(500).json({ message: err.message });
  }
});
export default router;
