// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },

    // Personal Info (required ONLY after completion)
    fullName: {
      type: String,
      required: function () {
        return this.profileCompleted;
      },
    },
    email: {
      type: String,
      required: function () {
        return this.profileCompleted;
      },
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      required: function () {
        return this.profileCompleted;
      },
    },
    dateOfBirth: {
      type: Date,
      required: function () {
        return this.profileCompleted;
      },
    },

    // Identity
    voterId: {
      type: String,
      required: function () {
        return this.profileCompleted;
      },
      unique: true,
    },
    aadharCard: {
      type: String,
      required: function () {
        return this.profileCompleted;
      },
      unique: true,
    },

    // Location
    district: {
      type: String,
      required: function () {
        return this.profileCompleted;
      },
    },
    taluka: {
      type: String,
      required: function () {
        return this.profileCompleted;
      },
    },
    city: {
      type: String,
      required: function () {
        return this.profileCompleted;
      },
    },

    // Voting Status
    hasVoted: { type: Boolean, default: false },
    votedInElection: { type: mongoose.Schema.Types.ObjectId, ref: "Election" },

    profileCompleted: { type: Boolean, default: false },

    imageUrl: String,
    role: { type: String, enum: ["admin", "voter"], default: "voter" },
  },
  { timestamps: true }
);


// Indexes for fast lookup

const User = mongoose.model("User", userSchema);
export default User;