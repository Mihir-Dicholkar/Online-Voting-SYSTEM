import { useState } from "react";
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
import { maharashtraSectors } from "../data/maharashtraSectors"; // import your mock data

const COLORS = ["#2563eb", "#16a34a", "#f59e0b"]; // Party A, B, C colors

export default function Dashboard() {
  const [sectors] = useState(maharashtraSectors);

  // Prepare Line Chart data (Voter Turnout per Region)
  const turnoutData = sectors.map((s) => ({
    name: s.name,
    turnout: s.lokSabha.voterTurnout,
  }));

  // Aggregate total votes for Pie Chart
  const totalVotes = { "Party A": 0, "Party B": 0, "Party C": 0 };
  sectors.forEach((s) => {
    Object.entries(s.lokSabha.results).forEach(([party, data]) => {
      totalVotes[party] += data.votes;
    });
  });

  const pieData = Object.entries(totalVotes).map(([name, value]) => ({
    name,
    value,
  }));

  // Count stats
  const activeElections = 3;
  const completedElections = 5;
  const totalVoters = sectors.reduce((sum, s) => sum + s.lokSabha.totalVotes, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Election Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Overview of Maharashtra election data (mock visualization)
      </p>

      {/* Stat Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition">
          <h2 className="font-semibold text-gray-600">Active Elections</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{activeElections}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition">
          <h2 className="font-semibold text-gray-600">Completed Elections</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{completedElections}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition">
          <h2 className="font-semibold text-gray-600">Total Voters</h2>
          <p className="text-4xl font-bold text-amber-600 mt-2">
            {(totalVoters / 1000000).toFixed(2)}M
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Voter Turnout by Region (%)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={turnoutData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[50, 80]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="turnout" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Vote Share by Party
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-10 bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Constituency Overview</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {sectors.map((s) => (
            <div key={s.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-blue-600">{s.name}</h3>
              <p className="text-sm text-gray-600">{s.description}</p>
              <p className="mt-2 text-gray-700">
                <span className="font-semibold">Turnout:</span> {s.lokSabha.voterTurnout}% <br />
                <span className="font-semibold">Winner:</span>{" "}
                {Object.entries(s.lokSabha.results).find(([_, v]) => v.winner)?.[0]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
