import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    voterId: {
      type: String, // Clerk userId
      required: true,
      index: true,
    },
    voterEmail: {
      type: String,
      required: true,
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    party: {
      type: String,
      required: true,
    },
    candidateName: String,
  },
  { timestamps: true }
);

export default mongoose.model("Vote", voteSchema);
