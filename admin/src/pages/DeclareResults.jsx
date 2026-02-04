import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, Trophy } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default function DeclareResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [declaringId, setDeclaringId] = useState(null);

  const fetchResults = async () => {
    try {
      const res = await api.get("/api/results/declared");
      setResults(res.data);
    } catch (err) {
      console.error("Failed to fetch declared results", err);
    } finally {
      setLoading(false);
    }
  };

  const declareResult = async (electionId) => {
    try {
      setDeclaringId(electionId);
      await api.post(`/elections/${electionId}/declare-result`);
      toast.success("Result declared successfully");
      fetchResults();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to declare result");
    } finally {
      setDeclaringId(null);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading declared results...
      </p>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <Trophy className="w-8 h-8 text-yellow-500" />
        Election Results
      </h1>

      {results.length === 0 ? (
        <p className="text-gray-600">No results declared yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((election) => {
            // sort candidates by votes (descending)
            const sortedCandidates = [...election.candidates].sort(
              (a, b) => b.votes - a.votes
            );

            return (
              <Card
                key={election._id}
                className="hover:shadow-lg transition-shadow border-gray-100"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {election.title}
                    <Info className="w-5 h-5 text-gray-400" />
                  </CardTitle>
                  <CardDescription>{election.region}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* 🏆 Winner */}
                  {election.winner ? (
                    <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-green-700 font-semibold">
                        Winner: {election.winner}
                      </span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => declareResult(election._id)}
                      disabled={declaringId === election._id}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {declaringId === election._id
                        ? "Declaring..."
                        : "Declare Result"}
                    </Button>
                  )}

                  {/* 📊 Candidate Vote Counts */}
                  <div className="pt-2 space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Vote Summary
                    </h3>

                    {sortedCandidates.map((candidate, index) => {
                      const isWinner =
                        election.winner &&
                        election.winner.includes(candidate.name);

                      return (
                        <div
                          key={candidate._id}
                          className={`flex justify-between items-center p-2 rounded-md text-sm
                            ${
                              isWinner
                                ? "bg-yellow-50 font-semibold"
                                : "bg-gray-100"
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            {isWinner && (
                              <Trophy className="w-4 h-4 text-yellow-500" />
                            )}
                            {index + 1}. {candidate.name} ({candidate.party})
                          </span>

                          <span>{candidate.votes} votes</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
