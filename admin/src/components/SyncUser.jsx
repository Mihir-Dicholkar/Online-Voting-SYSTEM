// admin-dashboard/src/components/SyncUser.jsx (create this new file)
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;
export default function SyncUser() {
  const { getToken, userId, isLoaded } = useAuth();
  const [syncStatus, setSyncStatus] = useState("idle"); // idle, syncing, success, error

  useEffect(() => {
    if (!isLoaded || !userId || syncStatus !== "idle") return;

    const syncUser = async () => {
      setSyncStatus("syncing");
      toast.info("Syncing user to database...");
    try {
        const token = await getToken();
        console.log("🔄 Frontend: Token fetched, calling sync");
        console.log("🌍 API URL:", API_URL); // DEBUG

        const res = await axios.post(
          `${API_URL}/api/users/sync`,
          {}, // empty body
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000 // 5s timeout
          }
        );

        if (res.data.success) {
          toast.success(`User synced! Role: ${res.data.user.role}`);
          setSyncStatus("success");
          console.log("✅ Frontend sync success:", res.data.user);
        } else {
          throw new Error(res.data.message);
        }
      } catch (err) {
        console.error("❌ Frontend sync error:", err); // DEBUG
        const msg = err.response?.data?.message || err.message || "Network error";
        toast.error(`Sync failed: ${msg}`);
        setSyncStatus("error");
      }
    };

    syncUser();
  }, [userId, isLoaded, getToken, syncStatus]);

  return null; // Invisible component
}