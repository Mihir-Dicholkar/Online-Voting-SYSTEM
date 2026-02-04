import express from "express";
import Election from "../models/Election.js"; // Your Mongoose Election model

const router = express.Router();

// GET all declared results
// router.get("/declared", async (req, res) => {
//   try {
//     // Fetch only elections that are completed and have results
//     const elections = await Election.find({ status: "completed" }).select(
//       "_id title region candidates"
//     );
    
//     // Map winners for each election
//     const results = elections.map((election) => {
//       const winnerCandidate = election.candidates.find(c => c.winner) || null;
//       return {
//         electionId: election._id,
//         title: election.title,
//         region: election.region,
//         winner: winnerCandidate
//           ? { name: winnerCandidate.name, party: winnerCandidate.party }
//           : null,
//       };
//     });

//     res.json(results);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch declared results" });
//   }
// });

router.get("/declared", async (req, res) => {
  try {
    const elections = await Election.find(
      { status: "completed" },
      {
        title: 1,
        region: 1,
        winner: 1,
        candidates: 1,
        status: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 });

    res.status(200).json(elections);
  } catch (error) {
    console.error("Error fetching declared results:", error);
    res.status(500).json({
      message: "Failed to fetch declared election results",
    });
  }
});

export default router;
