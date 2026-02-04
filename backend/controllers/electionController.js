import Election from "../models/Election.js";

export const declareElectionResult = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    if (election.status === "completed") {
      return res
        .status(400)
        .json({ message: "Results already declared" });
    }

    if (!election.candidates || election.candidates.length === 0) {
      return res
        .status(400)
        .json({ message: "No candidates found" });
    }

    // 🏆 Find highest voted candidate
    let winnerCandidate = election.candidates[0];

    for (let candidate of election.candidates) {
      if (candidate.votes > winnerCandidate.votes) {
        winnerCandidate = candidate;
      }
    }

    // ✅ Update election
    election.status = "completed";
    election.winner = `${winnerCandidate.name} (${winnerCandidate.party})`;

    await election.save();

    res.json({
      message: "Election result declared successfully",
      electionId: election._id,
      winner: winnerCandidate,
    });
  } catch (error) {
    console.error("Declare result error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
