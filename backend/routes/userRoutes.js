// routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import { getAuth, requireAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";


const router = express.Router();

router.post("/sync", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const clerkUser = req.auth;

    // This contains everything from Clerk

    // SAFELY extract email (Clerk sometimes hides it in emailAddresses)
    const primaryEmail = clerkUser.emailAddresses?.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    );
    const email = primaryEmail?.emailAddress || clerkUser.email || null;
    // routes/userRoutes.js - inside /sync
    const roleFromToken = clerkUser.publicMetadata?.role;
    let role = roleFromToken || "voter";

    // Fallback: fetch from Clerk API if not in token
    if (!roleFromToken && userId) {
      try {
        const clerkResponse = await fetch(
          `https://api.clerk.com/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        const clerkData = await clerkResponse.json();
        role = clerkData.public_metadata?.role || "voter";
        console.log("Fetched role from Clerk API:", role);
      } catch (e) {
        console.log("Could not fetch from Clerk API, using voter");
      }
    } // "admin" if set in Clerk dashboard

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = new User({
        clerkId: userId,
        firstName: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        email: email, // ← This is now safe (can be null)
        imageUrl: clerkUser.imageUrl || null,
        role: role, // ← Sets "admin" correctly
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

// Keep your admin-only /users list if needed
router.get("/me", async (req, res) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

     const email = clerkUser.emailAddresses?.[0]?.emailAddress;

if (!email) {
  return res.status(400).json({
    message: "No email found in Clerk account",
  });
}

      user = await User.create({
        clerkId: userId,
        email,
        role: "voter",
        profileCompleted: false,
      });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("❌ /me failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// routes/userRoutes.js
router.post("/complete-profile",  async (req, res) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    

    const {
      fullName,
      phone,
      dateOfBirth,
      voterId,
      aadharCard,
      district,
      taluka,
      city,
    } = req.body;

    if (
      !fullName || !phone || !dateOfBirth ||
      !voterId || !aadharCard ||
      !district || !taluka || !city
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileCompleted) {
      return res.status(403).json({ message: "Profile already completed" });
    }

  if (!user.email) {
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return res.status(400).json({
      message: "Email missing. Please login again.",
    });
  }

  user.email = email;
}

Object.assign(user, {
  fullName,
  phone,
  dateOfBirth,
  voterId,
  aadharCard,
  district,
  taluka,
  city,
  profileCompleted: true,
});

await user.save();


    return res.status(200).json({
      message: "Profile completed successfully",
    });

  } catch (err) {
    console.error("❌ Complete profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});



export default router;
