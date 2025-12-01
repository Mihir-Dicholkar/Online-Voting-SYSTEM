// admin-dashboard/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser, useAuth } from "@clerk/clerk-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SetElections from "./pages/SetElections";
import LiveElections from "./pages/LiveElections";
import DeclareResults from "./pages/DeclareResults";
import SyncUser from "./components/SyncUser";


// Protected Layout Component (with admin check)
function ProtectedAdminLayout({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Check if user is admin via Clerk public metadata
  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700">This admin panel is restricted to authorized personnel only.</p>
          <button
            onClick={() => window.location.href = "https://your-voter-app.com"}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Voter Portal
          </button>
        </div>
      </div>
    );
  }

  // User is admin → show dashboard
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}

// Main App
export default function App() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return <div>Missing Clerk Publishable Key</div>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <BrowserRouter>
      {/* ← This fixes everything */}
        <Routes>
          {/* Public route (optional sign-in page) */}
          <Route path="/sign-in/*" element={<RedirectToSignIn />} />
          <Route path="/sign-up/*" element={<RedirectToSignIn />} />

          {/* All other routes are protected */}
          <Route
            path="/*"
            element={
              <ProtectedAdminLayout>
                 <SyncUser /> 
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/set-elections" element={<SetElections />} />
                  <Route path="/live-elections" element={<LiveElections />} />
                  <Route path="/declare-results" element={<DeclareResults />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ProtectedAdminLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}