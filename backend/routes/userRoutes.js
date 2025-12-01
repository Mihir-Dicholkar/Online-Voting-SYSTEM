// routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import { getAuth } from "@clerk/express";

const router = express.Router();

/**
 * SYNC USER – Call this once after Clerk login (e.g., on app load)
 * Now uses req.auth directly → NO extra API call to Clerk!
 */
// routes/userRoutes.js - Update the /sync route
// routes/userRoutes.js → POST /api/users/sync
router.post("/sync", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const clerkUser = req.auth; // This contains everything from Clerk
      
    // SAFELY extract email (Clerk sometimes hides it in emailAddresses)
    const primaryEmail = clerkUser.emailAddresses?.find(e => e.id === clerkUser.primaryEmailAddressId);
    const email = primaryEmail?.emailAddress || clerkUser.email || null;
// routes/userRoutes.js - inside /sync
const roleFromToken = clerkUser.publicMetadata?.role;
let role = roleFromToken || "voter";

// Fallback: fetch from Clerk API if not in token
if (!roleFromToken && userId) {
  try {
    const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const clerkData = await clerkResponse.json();
    role = clerkData.public_metadata?.role || "voter";
    console.log("Fetched role from Clerk API:", role);
  } catch (e) {
    console.log("Could not fetch from Clerk API, using voter");
  }
}// "admin" if set in Clerk dashboard

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = new User({
        clerkId: userId,
        firstName: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        email: email,                    // ← This is now safe (can be null)
        imageUrl: clerkUser.imageUrl || null,
        role: role,                      // ← Sets "admin" correctly
      });
      await user.save();
      console.log("New user created:", user.email, "Role:", user.role);
    } else {
      // Update existing user
      user.firstName = clerkUser.firstName || user.firstName;
      user.lastName = clerkUser.lastName || user.lastName;
      user.email = email || user.email;
      user.imageUrl = clerkUser.imageUrl || user.imageUrl;
      user.role = role || user.role;
      await user.save();
      console.log("User updated:", user.email, "Role:", user.role);
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("SYNC ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});
// Optional: Get current logged-in user (useful for frontend)
router.get("/me", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: "User not found – sync first" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Keep your admin-only /users list if needed
router.get("/", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const currentUser = await User.findOne({ clerkId: userId });
    if (currentUser?.role !== "admin") {
      return res.status(403).json({ error: "Admins only" });
    }

    const users = await User.find().select("-__v");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// routes/userRoutes.js
router.post("/complete-profile", async (req, res) => {
  try {
    const auth = req.auth();
    const clerkId = auth?.userId;
    if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

    const {
      fullName, email, phone, dateOfBirth,
      voterId, aadharCard,
      district, taluka, city
    } = req.body

    // Validate all fields
    if (!fullName || !email || !phone || !dateOfBirth || !voterId || !aadharCard || !district || !taluka || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if already completed
    const existing = await User.findOne({ clerkId });
    if (existing?.profileCompleted) {
      return res.status(400).json({ message: "Profile already completed" });
    }

    // Create or update user
    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          fullName, email, phone,
          dateOfBirth: new Date(dateOfBirth),
          voterId, aadharCard,
          district, taluka, city,
          profileCompleted: true,
          hasVoted: false
        }
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile completion error:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Voter ID or Aadhar already registered" });
    }
    res.status(500).json({ message: "Server error" });
  }
});
export default router;