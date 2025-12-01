// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },

    // Personal Info
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },

    // Identity
    voterId: { type: String, required: true, unique: true },
    aadharCard: { type: String, required: true, unique: true },

    // Location (Maharashtra only)
    district: { type: String, required: true }, // e.g., "Mumbai City", "Pune"
    taluka: { type: String, required: true },
    city: { type: String, required: true },

    // Voting Status
    hasVoted: { type: Boolean, default: false },
    votedInElection: { type: mongoose.Schema.Types.ObjectId, ref: "Election", default: null },

    // Profile Completion
    profileCompleted: { type: Boolean, default: false },

    // Optional
    imageUrl: { type: String },
    role: { type: String, enum: ["admin", "voter"], default: "voter" },
  },
  { timestamps: true }
);

// Indexes for fast lookup
userSchema.index({ district: 1 });
userSchema.index({ voterId: 1 });
userSchema.index({ aadharCard: 1 });

const User = mongoose.model("User", userSchema);
export default User;