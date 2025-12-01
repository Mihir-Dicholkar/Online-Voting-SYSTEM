// src/pages/SetElections.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PlusCircle,
  Users,
  CalendarDays,
  Loader2,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";

const MAHARASHTRA_REGIONS = [
  "Mumbai City",
  "Mumbai Suburban",
  "Thane",
  "Palghar",
  "Raigad",
  "Ratnagiri",
  "Sindhudurg",
  "Pune",
  "Satara",
  "Sangli",
  "Kolhapur",
  "Solapur",
  "Ahmednagar",
  "Nashik",
  "Dhule",
  "Jalgaon",
  "Nandurbar",
  "Aurangabad",
  "Jalna",
  "Beed",
  "Parbhani",
  "Hingoli",
  "Nanded",
  "Latur",
  "Osmanabad",
  "Amravati",
  "Akola",
  "Washim",
  "Buldhana",
  "Yavatmal",
  "Wardha",
  "Nagpur",
  "Bhandara",
  "Gondia",
  "Chandrapur",
  "Gadchiroli",
];

export default function SetElections() {
  const { getToken } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Forms
  const [electionForm, setElectionForm] = useState({
    title: "",
    region: "",
    startDate: "",
    endDate: "",
  });
  const [candidateForm, setCandidateForm] = useState({
    electionId: "",
    name: "",
    party: "",
    logo: "",
  });

  // Modals
  const [editElectionModal, setEditElectionModal] = useState(null);
  const [editCandidateModal, setEditCandidateModal] = useState(null);

  const api = axios.create({ baseURL: "http://localhost:5000/api" });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const fetchElections = async () => {
    try {
      setLoading(true);
      const res = await api.get("/elections");
      setElections(res.data);
    } catch (err) {
      toast.error("Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  // CREATE ELECTION
  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/elections", electionForm);
      toast.success("Election announced!");
      setElectionForm({ title: "", region: "", startDate: "", endDate: "" });
      fetchElections();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  // ADD CANDIDATE
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post(`/elections/${candidateForm.electionId}/candidates`, {
        name: candidateForm.name,
        party: candidateForm.party,
        logo: candidateForm.logo || undefined,
      });
      toast.success("Candidate added!");
      setCandidateForm({ ...candidateForm, name: "", party: "", logo: "" });
      fetchElections();
    } catch (err) {
      toast.error("Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  // EDIT ELECTION
  const updateElection = async () => {
    try {
      setLoading(true);
      await api.put(`/elections/${editElectionModal._id}`, {
        title: editElectionModal.title,
        region: editElectionModal.region,
        startDate: editElectionModal.startDate,
        endDate: editElectionModal.endDate,
      });
      toast.success("Election updated!");
      setEditElectionModal(null);
      fetchElections();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // DELETE ELECTION
  const deleteElection = async (id) => {
    if (!window.confirm("Delete entire election? This cannot be undone."))
      return;
    try {
      setLoading(true);
      await api.delete(`/elections/${id}`);
      toast.success("Election deleted");
      fetchElections();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // EDIT CANDIDATE
  const updateCandidate = async () => {
    try {
      setLoading(true);
      await api.put(
        `/elections/${editCandidateModal.electionId}/candidates/${editCandidateModal.candidate._id}`,
        {
          name: editCandidateModal.candidate.name,
          party: editCandidateModal.candidate.party,
          logo: editCandidateModal.candidate.logo,
        }
      );
      toast.success("Candidate updated!");
      setEditCandidateModal(null);
      fetchElections();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // DELETE CANDIDATE
  const deleteCandidate = async (electionId, candidateId) => {
    if (!window.confirm("Delete this candidate?")) return;
    try {
      setLoading(true);
      await api.delete(`/elections/${electionId}/candidates/${candidateId}`);
      toast.success("Candidate removed");
      fetchElections();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
        </div>
      )}

      <div className="p-8 min-h-screen bg-linear-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 flex items-center justify-center gap-4">
            <CalendarDays className="w-12 h-12 text-blue-600" />
            Election Management Panel
          </h1>

          {/* Forms */}
          <div className="grid lg:grid-cols-2 gap-10 mb-12">
            {/* Create Election */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-3">
                <PlusCircle className="w-8 h-8" /> Announce New Election
              </h2>
              <form onSubmit={handleCreateElection} className="space-y-5">
                <input
                  type="text"
                  placeholder="Election Title"
                  value={electionForm.title}
                  onChange={(e) =>
                    setElectionForm({ ...electionForm, title: e.target.value })
                  }
                  className="w-full px-5 py-3 border rounded-xl focus:ring-4 focus:ring-blue-300"
                  required
                />
                <select
                  value={electionForm.region}
                  onChange={(e) =>
                    setElectionForm({ ...electionForm, region: e.target.value })
                  }
                  className="w-full px-5 py-3 border rounded-xl"
                  required
                >
                  <option value="">Select Region</option>
                  {MAHARASHTRA_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="datetime-local"
                    value={electionForm.startDate}
                    onChange={(e) =>
                      setElectionForm({
                        ...electionForm,
                        startDate: e.target.value,
                      })
                    }
                    required
                    className="px-5 py-3 border rounded-xl"
                  />
                  <input
                    type="datetime-local"
                    value={electionForm.endDate}
                    onChange={(e) =>
                      setElectionForm({
                        ...electionForm,
                        endDate: e.target.value,
                      })
                    }
                    required
                    className="px-5 py-3 border rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition"
                >
                  Announce Election
                </button>
              </form>
            </div>

            {/* Add Candidate */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-3">
                <Users className="w-8 h-8" /> Add Candidate
              </h2>
              <form onSubmit={handleAddCandidate} className="space-y-5">
                <select
                  value={candidateForm.electionId}
                  onChange={(e) =>
                    setCandidateForm({
                      ...candidateForm,
                      electionId: e.target.value,
                    })
                  }
                  className="w-full px-5 py-3 border rounded-xl"
                  required
                >
                  <option value="">Choose Election</option>
                  {elections.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.title} - {e.region}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={candidateForm.name}
                  onChange={(e) =>
                    setCandidateForm({ ...candidateForm, name: e.target.value })
                  }
                  required
                  className="w-full px-5 py-3 border rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Party Name"
                  value={candidateForm.party}
                  onChange={(e) =>
                    setCandidateForm({
                      ...candidateForm,
                      party: e.target.value,
                    })
                  }
                  required
                  className="w-full px-5 py-3 border rounded-xl"
                />
                <input
                  type="url"
                  placeholder="Logo URL (optional)"
                  value={candidateForm.logo}
                  onChange={(e) =>
                    setCandidateForm({ ...candidateForm, logo: e.target.value })
                  }
                  className="w-full px-5 py-3 border rounded-xl"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition"
                >
                  Add Candidate
                </button>
              </form>
            </div>
          </div>

          {/* Elections Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {elections.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 text-xl">
                No elections yet. Create one!
              </p>
            ) : (
              elections.map((election) => (
                <div
                  key={election._id}
                  className="bg-white rounded-2xl shadow-xl p-6 border hover:shadow-2xl transition relative group"
                >
                  {/* Election Edit/Delete Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => setEditElectionModal(election)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteElection(election._id)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-blue-700">
                    {election.title}
                  </h3>
                  <p className="text-gray-600 font-medium">{election.region}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(election.startDate).toLocaleString()} <br />→{" "}
                    {new Date(election.endDate).toLocaleString()}
                  </p>

                  <div className="mt-6">
                    <p className="font-semibold text-gray-700 mb-3">
                      Candidates ({election.candidates.length})
                    </p>
                    {election.candidates.length === 0 ? (
                      <p className="text-gray-400 italic">No candidates</p>
                    ) : (
                      <div className="space-y-3">
                        {election.candidates.map((c) => (
                          <div
                            key={c._id}
                            className="flex items-center justify-between bg-gray-50 p-4 rounded-xl group/item"
                          >
                            <div className="flex items-center gap-4">
                              {c.logo ? (
                                <img
                                  src={c.logo}
                                  alt={c.party}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                              )}
                              <div>
                                <p className="font-semibold">{c.name}</p>
                                <p className="text-sm text-gray-600">
                                  {c.party}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition">
                              <button
                                onClick={() =>
                                  setEditCandidateModal({
                                    electionId: election._id,
                                    candidate: { ...c },
                                  })
                                }
                                className="text-blue-600"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  deleteCandidate(election._id, c._id)
                                }
                                className="text-red-600"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Election Modal */}
      {editElectionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-blue-700">
              Edit Election
            </h3>
            <input
              className="w-full mb-4 px-4 py-3 border rounded-xl"
              value={editElectionModal.title}
              onChange={(e) =>
                setEditElectionModal({
                  ...editElectionModal,
                  title: e.target.value,
                })
              }
            />
            <select
              className="w-full mb-4 px-4 py-3 border rounded-xl"
              value={editElectionModal.region}
              onChange={(e) =>
                setEditElectionModal({
                  ...editElectionModal,
                  region: e.target.value,
                })
              }
            >
              <option value="">Select Region</option>
              {MAHARASHTRA_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              className="w-full mb-4 px-4 py-3 border rounded-xl"
              value={editElectionModal.startDate.slice(0, 16)}
              onChange={(e) =>
                setEditElectionModal({
                  ...editElectionModal,
                  startDate: e.target.value,
                })
              }
            />
            <input
              type="datetime-local"
              className="w-full mb-6 px-4 py-3 border rounded-xl"
              value={editElectionModal.endDate.slice(0, 16)}
              onChange={(e) =>
                setEditElectionModal({
                  ...editElectionModal,
                  endDate: e.target.value,
                })
              }
            />
            <div className="flex gap-4">
              <button
                onClick={updateElection}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> Update Election
              </button>
              <button
                onClick={() => setEditElectionModal(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Candidate Modal */}
      {editCandidateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-green-700">
              Edit Candidate
            </h3>
            <input
              className="w-full mb-4 px-4 py-3 border rounded-xl"
              placeholder="Name"
              value={editCandidateModal.candidate.name}
              onChange={(e) =>
                setEditCandidateModal({
                  ...editCandidateModal,
                  candidate: {
                    ...editCandidateModal.candidate,
                    name: e.target.value,
                  },
                })
              }
            />
            <input
              className="w-full mb-4 px-4 py-3 border rounded-xl"
              placeholder="Party"
              value={editCandidateModal.candidate.party}
              onChange={(e) =>
                setEditCandidateModal({
                  ...editCandidateModal,
                  candidate: {
                    ...editCandidateModal.candidate,
                    party: e.target.value,
                  },
                })
              }
            />
            <input
              className="w-full mb-6 px-4 py-3 border rounded-xl"
              placeholder="Logo URL"
              value={editCandidateModal.candidate.logo || ""}
              onChange={(e) =>
                setEditCandidateModal({
                  ...editCandidateModal,
                  candidate: {
                    ...editCandidateModal.candidate,
                    logo: e.target.value,
                  },
                })
              }
            />
            <div className="flex gap-4">
              <button
                onClick={updateCandidate}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl"
              >
                <Save className="w-5 h-5" /> Save Changes
              </button>
              <button
                onClick={() => setEditCandidateModal(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
