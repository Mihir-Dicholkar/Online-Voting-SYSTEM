import { useEffect, useState } from "react";
import axios from "axios";

/* shadcn */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

/* icons */
import {
  Radio,
  MapPin,
  Users,
  Loader2,
  TrendingUp,
  Trophy,
} from "lucide-react";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
});

/* 🔢 animated counter hook */
function useCountUp(value, duration = 500) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    let start = display;
    let startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setDisplay(Math.floor(start + (value - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return display;
}

export default function LiveElections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [declaringId, setDeclaringId] = useState(null);

  const fetchLiveElections = async () => {
    try {
      const res = await api.get("/api/elections/live");
      setElections(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch live elections", err);
    } finally {
      setLoading(false);
    }
  };

  const declareResults = async (electionId) => {
    try {
      setDeclaringId(electionId);
      await api.post(`/api/elections/${electionId}/declare`);
      fetchLiveElections(); // refresh list
    } catch (err) {
      console.error("Failed to declare results", err);
      alert("Error declaring results");
    } finally {
      setDeclaringId(null);
    }
  };

  useEffect(() => {
    fetchLiveElections();
    const interval = setInterval(fetchLiveElections, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span>Loading live elections...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Radio className="text-red-600 animate-pulse" />
          Live Elections
        </h1>

        {lastUpdated && (
          <Badge variant="outline" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Updated {lastUpdated.toLocaleTimeString()}
          </Badge>
        )}
      </div>

      {elections.length === 0 ? (
        <p className="text-muted-foreground">No live elections currently.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => (
            <Card key={election._id} className="relative overflow-hidden">
              <Badge className="absolute top-3 right-3 bg-red-600 animate-pulse">
                LIVE
              </Badge>

              <CardHeader>
                <CardTitle className="text-xl">{election.title}</CardTitle>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {election.region}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ElectionCandidates election={election} />

                {/* 🏆 Declare Results Button */}
                <Button
                  onClick={() => declareResults(election._id)}
                  disabled={declaringId === election._id}
                  className="w-full mt-4"
                >
                  {declaringId === election._id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Declaring...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Declare Results
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- */
/* Candidates                          */
/* ---------------------------------- */

function ElectionCandidates({ election }) {
  const totalVotes = election.candidates.reduce(
    (sum, c) => sum + c.votes,
    0
  );

  return (
    <>
      <p className="text-sm font-medium flex items-center gap-2">
        <Users className="w-4 h-4" />
        Total Votes: <strong>{totalVotes}</strong>
      </p>

      {election.candidates.map((candidate) => (
        <CandidateRow
          key={candidate._id}
          candidate={candidate}
          totalVotes={totalVotes}
        />
      ))}
    </>
  );
}

function CandidateRow({ candidate, totalVotes }) {
  const animatedVotes = useCountUp(candidate.votes);
  const percentage =
    totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">
          {candidate.name} ({candidate.party})
        </span>
        <span className="font-semibold">{animatedVotes}</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground text-right">
        {percentage}%
      </p>
    </div>
  );
}
