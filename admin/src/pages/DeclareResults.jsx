import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Info } from "lucide-react";

export default function DeclareResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/results/declared");
      setResults(res.data);
    } catch (err) {
      console.error("Failed to fetch declared results", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading declared results...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <CheckCircle className="w-8 h-8 text-green-600" />
        Declared Election Winners
      </h1>

      {results.length === 0 ? (
        <p className="text-gray-600">No results declared yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((election) => (
            <Card key={election.electionId} className="hover:shadow-lg transition-shadow border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {election.title}
                  <Info className="w-5 h-5 text-gray-400" />
                </CardTitle>
                <CardDescription>{election.region}</CardDescription>
              </CardHeader>
              <CardContent>
                {election.winner ? (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-700 font-semibold">
                      {election.winner.name} ({election.winner.party})
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Result not declared yet</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
