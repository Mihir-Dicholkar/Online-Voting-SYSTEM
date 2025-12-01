import { Clerk } from "@clerk/clerk-sdk-node";

const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Middleware to verify Clerk users
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing Authorization header" });

    const token = authHeader.replace("Bearer ", "");
    const session = await clerkClient.sessions.verifySession(token);

    if (!session) return res.status(401).json({ message: "Invalid session token" });

    // Attach user info to req
    req.user = session.user;
    next();
  } catch (err) {
    console.error("Clerk auth error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};
