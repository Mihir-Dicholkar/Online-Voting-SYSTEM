import express from "express";
import UserProfile from "../models/UserProfile.js";
import { ClerkExpressRequireAuth } from "@clerk/express";

const router = express.Router();

/**
 * @route   POST /api/profile
 * @desc    Create or update user profile
 * @access  Private (Clerk authenticated)
 */
router.post("/", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { personalDetails, verificationDetails, locationDetails } = req.body;

    if (!clerkUserId) return res.status(401).json({ message: "Unauthorized" });

    const existingProfile = await UserProfile.findOne({ clerkUserId });

    if (existingProfile) {
      // Update
      const updatedProfile = await UserProfile.findOneAndUpdate(
        { clerkUserId },
        { personalDetails, verificationDetails, locationDetails },
        { new: true }
      );
      return res.json({ message: "Profile updated", profile: updatedProfile });
    }

    // Create new profile
    const newProfile = new UserProfile({
      clerkUserId,
      personalDetails,
      verificationDetails,
      locationDetails,
    });

    await newProfile.save();

    res.status(201).json({ message: "Profile created", profile: newProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route   GET /api/profile
 * @desc    Get user profile by Clerk ID
 * @access  Private
 */
router.get("/", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const profile = await UserProfile.findOne({ clerkUserId });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
