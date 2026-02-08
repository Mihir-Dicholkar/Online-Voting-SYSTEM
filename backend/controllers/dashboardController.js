import Election from "../models/Election.js";
import Vote from "../models/Vote.js";
import User from "../models/User.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const now = new Date();

    /* ---------------- Completed Elections ---------------- */
    const completedElections = await Election.find({
      endDate: { $lt: now },
    });

    const completedElectionCount = completedElections.length;

    /* ---------------- Voters ---------------- */
    const voters = await User.find({ role: "voter" }).select(
      "name email clerkId createdAt"
    );

    /* ---------------- Votes ---------------- */
    const votes = await Vote.find().populate(
      "electionId",
      "title region"
    );

    /* ---------------- Vote Share ---------------- */
    const voteShareMap = {};
    votes.forEach((v) => {
      voteShareMap[v.party] = (voteShareMap[v.party] || 0) + 1;
    });

    const voteShare = Object.entries(voteShareMap).map(
      ([name, value]) => ({ name, value })
    );

    /* ---------------- Turnout by Region ---------------- */
    const turnoutByRegion = completedElections.map((e) => {
      const regionVotes = votes.filter(
        (v) => String(v.electionId._id) === String(e._id)
      );

      return {
        name: e.region,
        turnout: Math.min(
          100,
          Math.floor((regionVotes.length / e.totalVoters) * 100)
        ),
      };
    });

    res.json({
      completedElections: completedElectionCount,
      voters,
      votes,
      voteShare,
      turnoutByRegion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard failed" });
  }
};
