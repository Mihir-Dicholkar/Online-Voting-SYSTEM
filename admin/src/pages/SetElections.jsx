import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  PlusCircle,
  Users,
  CalendarDays,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  Power,
} from "lucide-react";

/* shadcn components */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const MAHARASHTRA_REGIONS = [
  "Mumbai City",
  "Mumbai Suburban",
  "Thane",
  "Pune",
  "Nashik",
  "Nagpur",
];

export default function SetElections() {
  const { getToken } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);

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
  });

  const [editElection, setEditElection] = useState(null);
  const [editCandidate, setEditCandidate] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  /* ---------------- FETCH ---------------- */
  const fetchElections = async () => {
    try {
      setLoading(true);
      const res = await api.get("/elections");
      setElections(res.data);
    } catch {
      toast.error("Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  /* ---------------- CREATE ---------------- */
  const createElection = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/elections", electionForm);
      toast.success("Election created");
      setElectionForm({ title: "", region: "", startDate: "", endDate: "" });
      fetchElections();
    } catch {
      toast.error("Creation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STATUS ---------------- */
  const activateElection = async (id) => {
    try {
      setLoading(true);
      await api.put(`/elections/${id}/activate`);
      toast.success("Election activated");
      fetchElections();
    } catch {
      toast.error("Activation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteElection = async (id) => {
    if (!confirm("Delete election permanently?")) return;
    try {
      setLoading(true);
      await api.delete(`/elections/${id}`);
      toast.success("Election deleted");
      fetchElections();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ADD CANDIDATE ---------------- */
  const addCandidate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post(
        `/elections/${candidateForm.electionId}/candidates`,
        {
          name: candidateForm.name,
          party: candidateForm.party,
        }
      );
      toast.success("Candidate added");
      setCandidateForm({ electionId: "", name: "", party: "" });
      fetchElections();
    } catch {
      toast.error("Candidate add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-white" />
        </div>
      )}

      <div className="p-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
          <CalendarDays className="w-10 h-10 text-blue-600" />
          Election Management
        </h1>

        {/* CREATE + ADD */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2">
                <PlusCircle /> Create Election
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createElection} className="space-y-4">
                <Input
                  placeholder="Election Title"
                  value={electionForm.title}
                  onChange={(e) =>
                    setElectionForm({ ...electionForm, title: e.target.value })
                  }
                />
                <Select
                  value={electionForm.region}
                  onValueChange={(v) =>
                    setElectionForm({ ...electionForm, region: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAHARASHTRA_REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="datetime-local"
                    value={electionForm.startDate}
                    onChange={(e) =>
                      setElectionForm({
                        ...electionForm,
                        startDate: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="datetime-local"
                    value={electionForm.endDate}
                    onChange={(e) =>
                      setElectionForm({
                        ...electionForm,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
                <Button className="w-full">Create Election</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2">
                <Users /> Add Candidate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addCandidate} className="space-y-4">
                <Select
                  value={candidateForm.electionId}
                  onValueChange={(v) =>
                    setCandidateForm({ ...candidateForm, electionId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose election" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map((e) => (
                      <SelectItem key={e._id} value={e._id}>
                        {e.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Candidate Name"
                  value={candidateForm.name}
                  onChange={(e) =>
                    setCandidateForm({ ...candidateForm, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Party"
                  value={candidateForm.party}
                  onChange={(e) =>
                    setCandidateForm({
                      ...candidateForm,
                      party: e.target.value,
                    })
                  }
                />
                <Button className="w-full">Add Candidate</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ELECTION LIST */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((e) => (
            <Card key={e._id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  {e.title}
                  <Badge
                    variant={
                      e.status === "active" ? "default" : "secondary"
                    }
                  >
                    {e.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>{e.region}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(e.startDate).toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => activateElection(e._id)}
                  >
                    <Power className="w-4 h-4 mr-1" /> Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteElection(e._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>

                <div className="pt-3 border-t">
                  <p className="font-semibold">
                    Candidates ({e.candidates.length})
                  </p>
                  {e.candidates.map((c) => (
                    <div key={c._id} className="text-sm">
                      • {c.name} ({c.party})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
