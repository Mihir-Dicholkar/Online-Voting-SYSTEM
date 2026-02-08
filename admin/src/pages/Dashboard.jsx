import { useEffect, useState } from "react";
import axios from "axios";

/* shadcn */
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/* recharts */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* icons */
import {
  Activity,
  CheckCircle,
  Users,
  TrendingUp,
  MapPin,
} from "lucide-react";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b"];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
});

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/api/dashboard/overview");
      setData({
  activeElections: res.data.activeElections ?? 0,
  completedElections: res.data.completedElections ?? 0,
  totalVoters: res.data.totalVoters ?? 0,
  turnoutByRegion: res.data.turnoutByRegion ?? [],
  voteShare: res.data.voteShare ?? [],
  regions: res.data.regions ?? [],
  voters: res.data.voters ?? [],
  votes: res.data.votes ?? [],
});

    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-muted/40 min-h-screen max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="text-blue-600" />
          Election Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-time insights across Maharashtra elections
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Active Elections"
          value={data.activeElections}
          icon={<Activity />}
          color="text-blue-600"
        />
        <StatCard
          title="Completed Elections"
          value={data.completedElections}
          icon={<CheckCircle />}
          color="text-green-600"
        />
        <StatCard
          title="Total Voters"
          value={`${(data.totalVoters / 1_000_000).toFixed(2)}M`}
          icon={<Users />}
          color="text-amber-600"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Line Chart */}
        <Card>
  <CardHeader>
    <CardTitle>Voter Turnout by Region (%)</CardTitle>
  </CardHeader>
  <CardContent className="h-[320px]">
    {data.turnoutByRegion.length === 0 ? (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No completed election data yet
      </div>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.turnoutByRegion}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="turnout"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )}
  </CardContent>
</Card>


        {/* Pie Chart */}
    <Card>
  <CardHeader>
    <CardTitle>Vote Share by Party</CardTitle>
  </CardHeader>
  <CardContent className="h-[320px]">
    {data.voteShare.length === 0 ? (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Votes not recorded yet
      </div>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.voteShare}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.voteShare.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )}
  </CardContent>
</Card>

      </div>

      {/* Regions */}
      <Card>
        <CardHeader>
          <CardTitle>Constituency Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          {data.regions.map((r) => (
            <div
              key={r._id}
              className="border rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {r.name}
                </h3>
                <Badge variant="outline">{r.turnout}% turnout</Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {r.description}
              </p>

              <Separator className="my-2" />

              <p className="text-sm">
                <span className="font-medium">Winning Party:</span>{" "}
                <strong>{r.winner}</strong>
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

<Card className="mt-12">
  <CardHeader>
    <CardTitle>Registered Voters</CardTitle>
  </CardHeader>
  <CardContent>
    {data.voters.length === 0 ? (
      <p className="text-center text-muted-foreground py-6">
        No registered voters yet
      </p>
    ) : (
      <div className="grid gap-3">
        {data.voters.map((v) => (
          <div
            key={v.clerkId}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition"
          >
            <div>
              <p className="font-semibold">{v.name}</p>
              <p className="text-xs text-muted-foreground">
                {v.email}
              </p>
            </div>
            <Badge variant="outline">
              {new Date(v.createdAt).toLocaleDateString()}
            </Badge>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>

<Card className="mt-12">
  <CardHeader>
    <CardTitle>Vote Records (Admin View)</CardTitle>
  </CardHeader>
  <CardContent>
    {data.votes.length === 0 ? (
      <p className="text-center text-muted-foreground py-6">
        No votes have been cast yet
      </p>
    ) : (
      <div className="space-y-4">
        {data.votes.map((v) => (
          <div
            key={v._id}
            className="border-l-4 border-blue-600 bg-background p-4 rounded-md"
          >
            <p className="text-sm">
              <strong>{v.voterEmail}</strong>{" "}
              voted for{" "}
              <Badge variant="secondary">{v.party}</Badge>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {v.electionId?.title} • {v.electionId?.region}
            </p>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>


    </div>
  );
}

/* ------------------------------- */
/* Stat Card Component             */
/* ------------------------------- */

function StatCard({ title, value, icon, color }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-4xl font-bold mt-2 ${color}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-muted ${color}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
