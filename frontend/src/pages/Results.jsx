
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
// Import the charts and chart components
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/",
});

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Results = () => {
  const [selectedSector, setSelectedSector] = useState(null);
  const [activeTab, setActiveTab] = useState('lokSabha');
  const [sectors, setSectors] = useState([]);
const [loading, setLoading] = useState(true);
const transformBackendResults = (elections) => {
  return elections.map((election) => {
    const totalVotes = election.candidates.reduce(
      (sum, c) => sum + c.votes,
      0
    );

    const results = {};
    election.candidates.forEach((c) => {
      results[c.party] = {
        votes: c.votes,
        winner: election.winner?.includes(c.name),
      };
    });

    return {
      id: election._id,
      name: election.region,
      description: `${election.title} Results`,
      lokSabha: {
        totalVotes,
        voterTurnout: totalVotes > 0 ? Math.min(100, Math.round((totalVotes / 2000000) * 100)) : 0,
        results,
      },
      rajyaSabha: {
        totalVotes: 0,
        voterTurnout: 0,
        results: {},
      },
    };
  });
};

useEffect(() => {
  const fetchResults = async () => {
    try {
      const res = await api.get("/api/results/declared");
   console.log("📦 RAW API RESPONSE:", res.data);

    const transformed = transformBackendResults(res.data);

    console.log("🔁 TRANSFORMED DATA (UI FORMAT):", transformed);
      setSectors(transformed);
    } catch (err) {
      console.error("Failed to load results", err);
    } finally {
      setLoading(false);
    }
  };

  fetchResults();
}, []);

  // More detailed dummy data for Maharashtra sectors
  // const sectors = [
  //   {
  //     id: 'mumbai-north',
  //     name: 'Mumbai North',
  //     lokSabha: {
  //       totalVotes: 1250000,
  //       voterTurnout: 65,
  //       results: {
  //         'Party A': { votes: 600000, winner: true },
  //         'Party B': { votes: 450000, winner: false },
  //         'Party C': { votes: 200000, winner: false },
  //       },
  //     },
  //     rajyaSabha: {
  //       totalVotes: 0, // No direct election for Rajya Sabha
  //       voterTurnout: 0,
  //       results: {
  //         'Party A': { seats: 1 },
  //         'Party B': { seats: 0 },
  //         'Party C': { seats: 0 },
  //       },
  //     },
  //     description: 'Key metropolitan constituency with diverse demographics.',
  //   },
  //   {
  //     id: 'pune',
  //     name: 'Pune',
  //     lokSabha: {
  //       totalVotes: 1500000,
  //       voterTurnout: 68,
  //       results: {
  //         'Party A': { votes: 550000, winner: false },
  //         'Party B': { votes: 700000, winner: true },
  //         'Party C': { votes: 250000, winner: false },
  //       },
  //     },
  //     rajyaSabha: {
  //       totalVotes: 0,
  //       voterTurnout: 0,
  //       results: {
  //         'Party A': { seats: 0 },
  //         'Party B': { seats: 1 },
  //         'Party C': { seats: 0 },
  //       },
  //     },
  //     description: 'Educational and IT hub of Maharashtra.',
  //   },
  //   {
  //     id: 'nagpur',
  //     name: 'Nagpur',
  //     lokSabha: {
  //       totalVotes: 1100000,
  //       voterTurnout: 72,
  //       results: {
  //         'Party A': { votes: 580000, winner: true },
  //         'Party B': { votes: 400000, winner: false },
  //         'Party C': { votes: 120000, winner: false },
  //       },
  //     },
  //     rajyaSabha: {
  //       totalVotes: 0,
  //       voterTurnout: 0,
  //       results: {
  //         'Party A': { seats: 1 },
  //         'Party B': { seats: 0 },
  //         'Party C': { seats: 0 },
  //       },
  //     },
  //     description: 'Winter capital and a major political center.',
  //   },
  //   {
  //     id: 'nashik',
  //     name: 'Nashik',
  //     lokSabha: {
  //       totalVotes: 1050000,
  //       voterTurnout: 63,
  //       results: {
  //         'Party A': { votes: 300000, winner: false },
  //         'Party B': { votes: 350000, winner: false },
  //         'Party C': { votes: 400000, winner: true },
  //       },
  //     },
  //     rajyaSabha: {
  //       totalVotes: 0,
  //       voterTurnout: 0,
  //       results: {
  //         'Party A': { seats: 0 },
  //         'Party B': { seats: 0 },
  //         'Party C': { seats: 1 },
  //       },
  //     },
  //     description: 'Known for its vineyards and religious significance.',
  //   },
  //   {
  //     id: 'aurangabad',
  //     name: 'Aurangabad',
  //     lokSabha: {
  //       totalVotes: 980000,
  //       voterTurnout: 60,
  //       results: {
  //         'Party A': { votes: 400000, winner: false },
  //         'Party B': { votes: 500000, winner: true },
  //         'Party C': { votes: 80000, winner: false },
  //       },
  //     },
  //     rajyaSabha: {
  //       totalVotes: 0,
  //       voterTurnout: 0,
  //       results: {
  //         'Party A': { seats: 0 },
  //         'Party B': { seats: 1 },
  //         'Party C': { seats: 0 },
  //       },
  //     },
  //     description: 'Historical city with significant cultural heritage.',
  //   },
  //   {
  //     id: 'kolhapur',
  //     name: 'Kolhapur',
  //     lokSabha: {
  //       totalVotes: 850000,
  //       voterTurnout: 70,
  //       results: {
  //         'Party A': { votes: 450000, winner: true },
  //         'Party B': { votes: 300000, winner: false },
  //         'Party C': { votes: 100000, winner: false },
  //       },
  //     },
  //     rajyaSabha: {
  //       totalVotes: 0,
  //       voterTurnout: 0,
  //       results: {
  //         'Party A': { seats: 1 },
  //         'Party B': { seats: 0 },
  //         'Party C': { seats: 0 },
  //       },
  //     },
  //     description: 'Known for its traditional industries and wrestling.',
  //   },
  // ];

  // Function to calculate overall summary data
  const getOverallSummary = () => {
    let lokSabhaSeats = {};
    let rajyaSabhaSeats = {};
    let totalTurnout = 0;
    let totalSectors = sectors.length;

    sectors.forEach(sector => {
      // Aggregate Lok Sabha seats
      Object.entries(sector.lokSabha.results).forEach(([party, data]) => {
        if (data.winner) {
          lokSabhaSeats[party] = (lokSabhaSeats[party] || 0) + 1;
        }
      });
      // Aggregate Rajya Sabha seats
      Object.entries(sector.rajyaSabha.results).forEach(([party, data]) => {
        rajyaSabhaSeats[party] = (rajyaSabhaSeats[party] || 0) + data.seats;
      });
      // Sum up voter turnout
      totalTurnout += sector.lokSabha.voterTurnout;
    });

    // Calculate winning party
    const lokSabhaWinningParty = Object.keys(lokSabhaSeats).reduce((a, b) => 
      lokSabhaSeats[a] > lokSabhaSeats[b] ? a : b, 'None');

    return {
      lokSabhaSeats,
      rajyaSabhaSeats,
      averageTurnout: (totalTurnout / totalSectors).toFixed(2),
      lokSabhaWinningParty
    };
  };

  const overallSummary = getOverallSummary();

  const handleSectorClick = (sector) => {
    setSelectedSector(sector);
  };

  const handleBackClick = () => {
    setSelectedSector(null);
  };

  // Helper functions to format data for charts
  const getLokSabhaChartData = (sector) => {
    const labels = Object.keys(sector.lokSabha.results);
    const data = Object.values(sector.lokSabha.results).map(result => result.votes);
    return {
      labels: labels,
      datasets: [
        {
          label: 'Votes',
          data: data,
          backgroundColor: ['#2563EB', '#FBBF24', '#EF4444'],
          borderColor: ['#1D4ED8', '#D97706', '#B91C1C'],
          borderWidth: 1,
        },
      ],
    };
  };

  const getRajyaSabhaChartData = (sector) => {
    const labels = Object.keys(sector.rajyaSabha.results);
    const data = Object.values(sector.rajyaSabha.results).map(result => result.seats);
    return {
      labels: labels,
      datasets: [
        {
          label: 'Seats',
          data: data,
          backgroundColor: ['#4F46E5', '#A855F7', '#EC4899'],
          borderColor: ['#4338CA', '#9333EA', '#DB2777'],
          borderWidth: 1,
        },
      ],
    };
  };

  const getVoterTurnoutChartData = (sector) => {
    const voterTurnout = sector.lokSabha.voterTurnout;
    const remaining = 100 - voterTurnout;
    return {
      labels: ['Voter Turnout', 'Non-Voters'],
      datasets: [
        {
          data: [voterTurnout, remaining],
          backgroundColor: ['#10B981', '#E5E7EB'],
          hoverBackgroundColor: ['#059669', '#D1D5DB'],
        },
      ],
    };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };
if (loading) {
  return (
    <>
      <Header />
      <div className="text-center py-20 text-xl text-gray-600">
        Loading election results...
      </div>
      <Footer />
    </>
  );
}

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 py-8 min-h-[calc(100vh-16rem)]">
        <motion.h1 
          className="text-4xl font-extrabold text-center text-gray-800 mb-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Maharashtra Election Results
        </motion.h1>

        <AnimatePresence mode="wait">
          {selectedSector ? (
            // Detailed view for a selected sector
            <motion.div
              key="detail-view"
              className="bg-white p-8 rounded-lg shadow-xl max-w-5xl mx-auto"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={handleBackClick}
                className="mb-6 bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Sectors
              </motion.button>
              
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedSector.name} Sector Results</h2>
                <p className="text-gray-600">{selectedSector.description}</p>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex mb-6 border-b">
                <button
                  className={`px-4 py-2 font-semibold ${activeTab === 'lokSabha' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('lokSabha')}
                >
                  Lok Sabha
                </button>
                <button
                  className={`px-4 py-2 font-semibold ${activeTab === 'rajyaSabha' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('rajyaSabha')}
                >
                  Rajya Sabha
                </button>
                <button
                  className={`px-4 py-2 font-semibold ${activeTab === 'voterTurnout' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('voterTurnout')}
                >
                  Voter Turnout
                </button>
              </div>
              
              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'lokSabha' && (
                  <motion.div
                    key="lok-sabha"
                    className="bg-gray-50 p-6 rounded-lg shadow-inner"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4">Lok Sabha Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <motion.div 
                        className="h-64"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Bar options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Vote Distribution by Party' } } }} data={getLokSabhaChartData(selectedSector)} />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <h4 className="text-xl font-bold mb-3">Vote Breakdown</h4>
                        <ul className="space-y-2">
                          {Object.entries(selectedSector.lokSabha.results).map(([party, data], index) => (
                            <motion.li 
                              key={party} 
                              className={`flex justify-between items-center p-3 rounded-md shadow-sm ${data.winner ? 'bg-green-100' : 'bg-white'}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                              <span className="font-medium text-gray-700">{party}</span>
                              <div className="flex items-center">
                                <span className="font-bold text-lg mr-2">{data.votes.toLocaleString()} Votes</span>
                                {data.winner && (
                                  <motion.span 
                                    className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.5 + 0.1 * index }}
                                  >
                                    Winner
                                  </motion.span>
                                )}
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'rajyaSabha' && (
                  <motion.div
                    key="rajya-sabha"
                    className="bg-gray-50 p-6 rounded-lg shadow-inner"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-semibold text-purple-700 mb-4">Rajya Sabha Seats</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <motion.div 
                        className="h-64"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Bar options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Rajya Sabha Seats by Party' } } }} data={getRajyaSabhaChartData(selectedSector)} />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <ul className="space-y-2">
                          {Object.entries(selectedSector.rajyaSabha.results).map(([party, data], index) => (
                            <motion.li 
                              key={party} 
                              className="flex justify-between items-center p-3 rounded-md shadow-sm bg-purple-100"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                              <span className="font-medium text-gray-700">{party}</span>
                              <span className="font-bold text-xl text-purple-800">{data.seats} Seat(s)</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'voterTurnout' && (
                  <motion.div
                    key="voter-turnout"
                    className="bg-gray-50 p-6 rounded-lg shadow-inner"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-semibold text-green-700 mb-4">Voter Turnout</h3>
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className="h-64 w-64"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Pie data={getVoterTurnoutChartData(selectedSector)} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
                      </motion.div>
                      <motion.p 
                        className="text-center text-gray-700 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        Total Voter Turnout: 
                        <motion.span 
                          className="font-bold text-2xl text-green-600 ml-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          {selectedSector.lokSabha.voterTurnout}%
                        </motion.span>
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Overall Summary Dashboard */}
              <motion.div 
                className="bg-gray-100 p-6 rounded-lg shadow-inner mb-10"
                variants={itemVariants}
              >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Overall Maharashtra Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  
                  {/* Total Lok Sabha Seats Card */}
                  <motion.div 
                    className="bg-white p-6 rounded-lg shadow-md border-b-4 border-blue-500"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3 className="text-lg font-semibold text-gray-600">Lok Sabha Seats</h3>
                    <div className="mt-4">
                      {Object.entries(overallSummary.lokSabhaSeats).map(([party, seats], index) => (
                        <motion.p 
                          key={party} 
                          className="text-2xl font-bold text-gray-800"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                          {party}: <span className="text-blue-600">{seats}</span>
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>

                  {/* Total Rajya Sabha Seats Card */}
                  <motion.div 
                    className="bg-white p-6 rounded-lg shadow-md border-b-4 border-purple-500"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3 className="text-lg font-semibold text-gray-600">Rajya Sabha Seats</h3>
                    <div className="mt-4">
                      {Object.entries(overallSummary.rajyaSabhaSeats).map(([party, seats], index) => (
                        <motion.p 
                          key={party} 
                          className="text-2xl font-bold text-gray-800"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                          {party}: <span className="text-purple-600">{seats}</span>
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>

                  {/* Average Voter Turnout Card */}
                  <motion.div 
                    className="bg-white p-6 rounded-lg shadow-md border-b-4 border-green-500"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3 className="text-lg font-semibold text-gray-600">Average Voter Turnout</h3>
                    <motion.p 
                      className="text-5xl font-bold text-green-600 mt-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {overallSummary.averageTurnout}%
                    </motion.p>
                  </motion.div>

                  {/* Overall Winner Card */}
                  <motion.div 
                    className="bg-white p-6 rounded-lg shadow-md border-b-4 border-yellow-500"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3 className="text-lg font-semibold text-gray-600">Lok Sabha Winner</h3>
                    <motion.p 
                      className="text-3xl font-bold text-yellow-600 mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {overallSummary.lokSabhaWinningParty}
                    </motion.p>
                  </motion.div>

                </div>
              </motion.div>

              {/* Grid view of all sectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sectors.map((sector, index) => (
                  <motion.div
                    key={sector.id}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSectorClick(sector)}
                    className="bg-white p-6 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out border border-gray-200"
                  >
                    <h2 className="text-2xl font-bold text-blue-700 mb-3">{sector.name}</h2>
                    <p className="text-gray-600 text-sm mb-4">{sector.description}</p>
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="font-semibold">Lok Sabha:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {Object.values(sector.lokSabha.results).reduce((sum, result) => sum + (result.winner ? 1 : 0), 0)} Winner
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700 mt-2">
                      <span className="font-semibold">Rajya Sabha:</span>
                      <span className="text-lg font-bold text-purple-600">
                        {Object.values(sector.rajyaSabha.results).reduce((sum, result) => sum + result.seats, 0)} Seats
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
};

export default Results;