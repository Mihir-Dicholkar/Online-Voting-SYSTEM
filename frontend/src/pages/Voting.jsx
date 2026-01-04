import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from "axios";
import api from "../api.js";

// Icon for expanding/collapsing
const ChevronIcon = ({ expanded }) => (
    <svg className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
);

// Simple Success Modal
const SuccessModal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm transform scale-100 transition-transform duration-300">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Vote Recorded!</h3>
            <p className="text-gray-700 font-medium">{message}</p>
            <p className="text-sm text-gray-500 mt-3">You will need to reload the page to vote again.</p>
            <button
                onClick={onClose}
                className="mt-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150"
            >
                Close
            </button>
        </div>
    </div>
);

// --- Main Voting Component ---
function Voting() {
 const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [activeTab, setActiveTab] = useState("current");
  const [expandedSectorId, setExpandedSectorId] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDistrict, setUserDistrict] = useState("");
  const [hasVotedMap, setHasVotedMap] = useState({}); // electionId → true/false
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    });

    // Automatically add Clerk JWT to every request
    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken(); // This gets the fresh JWT
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Failed to get token:", err);
      }
      return config;
    });

    return instance;
  }, [getToken]);

  // Fetch user profile (to get district & voting status)
useEffect(() => {
  const fetchUser = async () => {
    if (!isSignedIn) {
      console.log("User not signed in (Clerk)");
      return;
    }

    console.log("Fetching user from /api/users/me...");
    try {
      const res = await api.get("/api/users/me");
      console.log("User API response:", res.data);

      const userData = res.data?.user || res.data;
      console.log("User district:", userData.district);
      console.log("hasVoted:", userData.hasVoted);
      console.log("votedInElection:", userData.votedInElection);

      setUserDistrict(userData.district || "Unknown");
      if (userData.hasVoted && userData.votedInElection) {
        setHasVotedMap({ [userData.votedInElection]: true });
      }
    } catch (err) {
      console.error("User fetch failed:", err.response?.data || err.message);
    }
  };

  fetchUser();
}, [isSignedIn, api]);

useEffect(() => {
  const fetchElections = async () => {
    console.log("Fetching elections from /api/elections...");
    try {
      const res = await api.get("/api/elections");
      console.log("Raw elections response:", res.data);

      const list = Array.isArray(res.data) ? res.data : [];
      console.log("Parsed elections array:", list);

      const now = new Date();
      console.log("Current time:", now);

      const active = list.filter(e => {
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        const isActive = e.status === "active" && start <= now && end >= now;
        console.log(`Election ${e.title}: status=${e.status}, start=${start}, end=${end}, active=${isActive}`);
        return isActive;
      });

      console.log("Final active elections:", active);
      setElections(active);
    } catch (err) {
      console.error("Elections fetch failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchElections();
}, [api]);
  const toggleExpansion = (id) => {
    setExpandedSectorId(id === expandedSectorId ? null : id);
  };

  const handleVote = async (electionId, candidateName, party) => {
    if (hasVotedMap[electionId]) return;

    try {
      await axios.post(
        `/api/elections/${electionId}/vote`,
        { candidateId: elections.find(e => e._id === electionId).candidates.find(c => c.name === candidateName)._id },
        { headers: { Authorization: `Bearer ${user.id}` } }
      );

      setHasVotedMap(prev => ({ ...prev, [electionId]: true }));
      setModalMessage(`Your vote for "${candidateName} (${party})" has been recorded successfully!`);
      setShowSuccessModal(true);
      setExpandedSectorId(null);
    } catch (err) {
      setModalMessage(err.response?.data?.message || "Vote failed. Try again.");
      setShowSuccessModal(true);
    }
  };

  const totalVotesAll = useMemo(() => 
    elections.reduce((sum, e) => sum + e.candidates.reduce((s, c) => s + c.votes, 0), 0),
    [elections]
  );

  const renderCurrentElections = () => {
    if (loading) return <p className="text-center py-10">Loading elections...</p>;
    if (elections.length === 0) return <p className="text-center py-10 text-gray-600">No active elections right now.</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elections.map((election) => {
          const totalVotes = election.candidates.reduce((sum, c) => sum + c.votes, 0);
          const canVote = userDistrict === election.region && !hasVotedMap[election._id];
          const hasVoted = hasVotedMap[election._id];
          const isExpanded = election._id === expandedSectorId;
          const statusColor = "bg-red-500"; // All active

          return (
            <div
              key={election._id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border ${
                hasVoted ? "border-green-400" : canVote ? "border-indigo-300" : "border-gray-100"
              }`}
            >
              {/* Header */}
              <div className="p-5 bg-indigo-50 border-b border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-800 flex justify-between items-start">
                  {election.region} District
                  <span className="text-xs font-semibold py-1 px-3 rounded-full text-white bg-red-500">
                    Live
                  </span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">{election.title}</p>
                {hasVoted && (
                  <p className="mt-2 text-green-700 font-semibold text-sm">
                    Voted successfully
                  </p>
                )}
                {!hasVoted && !canVote && userDistrict && (
                  <p className="mt-2 text-orange-600 font-medium text-xs">
                    Not eligible (Your district: {userDistrict})
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="p-5 grid grid-cols-2 gap-4" onClick={() => toggleExpansion(election._id)}>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Votes</p>
                  <p className="text-2xl font-extrabold text-indigo-700">{totalVotes.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Share of State</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="h-2.5 rounded-full bg-amber-500" 
                      style={{ width: `${totalVotesAll > 0 ? (totalVotes / totalVotesAll * 100).toFixed(1) : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Toggle Button */}
              <div 
                className="p-4 flex justify-between items-center text-indigo-600 hover:bg-indigo-50 cursor-pointer border-t"
                onClick={() => toggleExpansion(election._id)}
              >
                <span className="font-semibold text-sm">
                  {isExpanded ? "Hide" : hasVoted ? "View Results" : canVote ? "Cast Your Vote" : "View Only"}
                </span>
                <ChevronIcon expanded={isExpanded} />
              </div>

              {/* Expanded View */}
              {isExpanded && (
                <div className="p-5 border-t border-indigo-100 bg-gray-50">
                  <h4 className="font-bold text-lg mb-4 text-indigo-700">Candidates</h4>
                  {election.candidates
                    .sort((a, b) => b.votes - a.votes)
                    .map((candidate) => {
                      const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;

                      return (
                        <div key={candidate._id} className="mb-4 pb-4 border-b last:border-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">
                              {candidate.name} ({candidate.party})
                            </span>
                            <span className="font-bold">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div 
                              className="h-2.5 rounded-full bg-indigo-600" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{candidate.votes.toLocaleString()} votes</span>

                          {canVote && (
                            <button
                              onClick={() => handleVote(election._id, candidate.name, candidate.party)}
                              className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                            >
                              Vote for {candidate.name.split(" ")[0]}
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Keep your existing renderUpcomingElections() and tab UI unchanged
  const renderUpcomingElections = () => (
    <div className="text-center py-20 text-gray-500">
      <p>No upcoming elections data yet.</p>
    </div>
  );

  const getTabClasses = (tabName) => 
    `px-6 py-3 font-semibold rounded-t-lg transition duration-200 focus:outline-none ${
      activeTab === tabName
        ? 'bg-white text-indigo-800 border-b-4 border-amber-500 shadow-t'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-inter">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <section className="text-center py-10 bg-indigo-700 rounded-xl shadow-xl mb-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
            Maharashtra Election Watch
          </h2>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
            Track live elections and cast your vote securely
          </p>
        </section>

        <div className="flex border-b border-gray-200 mb-6">
          <button className={getTabClasses('current')} onClick={() => setActiveTab('current')}>
            Current Elections
          </button>
          <button className={getTabClasses('upcoming')} onClick={() => setActiveTab('upcoming')}>
            Upcoming Elections
          </button>
        </div>

        <section>
          {activeTab === 'current' ? renderCurrentElections() : renderUpcomingElections()}
        </section>
      </main>

      {showSuccessModal && (
        <SuccessModal 
          message={modalMessage} 
          onClose={() => setShowSuccessModal(false)} 
        />
      )}

      <Footer />
    </div>
  );
}

export default Voting;
