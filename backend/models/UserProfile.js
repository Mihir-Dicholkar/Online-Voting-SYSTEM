import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true, // one profile per Clerk user
    },
    personalDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      dateOfBirth: { type: Date },
    },
    verificationDetails: {
      voterId: { type: String, required: true },
      aadharCard: { type: String, required: true },
    },
    locationDetails: {
      district: { type: String, required: true },
      taluka: { type: String, required: true },
      city: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
