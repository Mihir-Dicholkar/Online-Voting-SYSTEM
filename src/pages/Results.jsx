import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Import the charts and chart components
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

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

  // More detailed dummy data for Maharashtra sectors
  const maharashtraSectors = [
    {
      id: 'mumbai-north',
      name: 'Mumbai North',
      lokSabha: {
        totalVotes: 1250000,
        voterTurnout: 65,
        results: {
          'Party A': { votes: 600000, winner: true },
          'Party B': { votes: 450000, winner: false },
          'Party C': { votes: 200000, winner: false },
        },
      },
      rajyaSabha: {
        totalVotes: 0, // No direct election for Rajya Sabha
        voterTurnout: 0,
        results: {
          'Party A': { seats: 1 },
          'Party B': { seats: 0 },
          'Party C': { seats: 0 },
        },
      },
      description: 'Key metropolitan constituency with diverse demographics.',
    },
    {
      id: 'pune',
      name: 'Pune',
      lokSabha: {
        totalVotes: 1500000,
        voterTurnout: 68,
        results: {
          'Party A': { votes: 550000, winner: false },
          'Party B': { votes: 700000, winner: true },
          'Party C': { votes: 250000, winner: false },
        },
      },
      rajyaSabha: {
        totalVotes: 0,
        voterTurnout: 0,
        results: {
          'Party A': { seats: 0 },
          'Party B': { seats: 1 },
          'Party C': { seats: 0 },
        },
      },
      description: 'Educational and IT hub of Maharashtra.',
    },
    {
      id: 'nagpur',
      name: 'Nagpur',
      lokSabha: {
        totalVotes: 1100000,
        voterTurnout: 72,
        results: {
          'Party A': { votes: 580000, winner: true },
          'Party B': { votes: 400000, winner: false },
          'Party C': { votes: 120000, winner: false },
        },
      },
      rajyaSabha: {
        totalVotes: 0,
        voterTurnout: 0,
        results: {
          'Party A': { seats: 1 },
          'Party B': { seats: 0 },
          'Party C': { seats: 0 },
        },
      },
      description: 'Winter capital and a major political center.',
    },
    {
      id: 'nashik',
      name: 'Nashik',
      lokSabha: {
        totalVotes: 1050000,
        voterTurnout: 63,
        results: {
          'Party A': { votes: 300000, winner: false },
          'Party B': { votes: 350000, winner: false },
          'Party C': { votes: 400000, winner: true },
        },
      },
      rajyaSabha: {
        totalVotes: 0,
        voterTurnout: 0,
        results: {
          'Party A': { seats: 0 },
          'Party B': { seats: 0 },
          'Party C': { seats: 1 },
        },
      },
      description: 'Known for its vineyards and religious significance.',
    },
    {
      id: 'aurangabad',
      name: 'Aurangabad',
      lokSabha: {
        totalVotes: 980000,
        voterTurnout: 60,
        results: {
          'Party A': { votes: 400000, winner: false },
          'Party B': { votes: 500000, winner: true },
          'Party C': { votes: 80000, winner: false },
        },
      },
      rajyaSabha: {
        totalVotes: 0,
        voterTurnout: 0,
        results: {
          'Party A': { seats: 0 },
          'Party B': { seats: 1 },
          'Party C': { seats: 0 },
        },
      },
      description: 'Historical city with significant cultural heritage.',
    },
    {
      id: 'kolhapur',
      name: 'Kolhapur',
      lokSabha: {
        totalVotes: 850000,
        voterTurnout: 70,
        results: {
          'Party A': { votes: 450000, winner: true },
          'Party B': { votes: 300000, winner: false },
          'Party C': { votes: 100000, winner: false },
        },
      },
      rajyaSabha: {
        totalVotes: 0,
        voterTurnout: 0,
        results: {
          'Party A': { seats: 1 },
          'Party B': { seats: 0 },
          'Party C': { seats: 0 },
        },
      },
      description: 'Known for its traditional industries and wrestling.',
    },
  ];

  // Function to calculate overall summary data
  const getOverallSummary = () => {
    let lokSabhaSeats = {};
    let rajyaSabhaSeats = {};
    let totalTurnout = 0;
    let totalSectors = maharashtraSectors.length;

    maharashtraSectors.forEach(sector => {
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

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 py-8 min-h-[calc(100vh-16rem)]">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Maharashtra Election Results
        </h1>

        {selectedSector ? (
          // Detailed view for a selected sector
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-5xl mx-auto animate-fade-in">
            <button
              onClick={handleBackClick}
              className="mb-6 bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Sectors
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedSector.name} Sector Results</h2>
            <p className="text-gray-600 mb-6">{selectedSector.description}</p>
            
            {/* Lok Sabha Results */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">Lok Sabha Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="h-64">
                  <Bar options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Vote Distribution by Party' } } }} data={getLokSabhaChartData(selectedSector)} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-3">Vote Breakdown</h4>
                  <ul className="space-y-2">
                    {Object.entries(selectedSector.lokSabha.results).map(([party, data]) => (
                      <li key={party} className={`flex justify-between items-center p-3 rounded-md shadow-sm ${data.winner ? 'bg-green-100' : 'bg-white'}`}>
                        <span className="font-medium text-gray-700">{party}</span>
                        <div className="flex items-center">
                          <span className="font-bold text-lg mr-2">{data.votes.toLocaleString()} Votes</span>
                          {data.winner && (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">Winner</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Voter Turnout and Rajya Sabha Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-2xl font-semibold text-green-700 mb-4">Voter Turnout</h3>
                <div className="h-64 flex justify-center items-center">
                  <div className="w-56 h-56">
                    <Pie data={getVoterTurnoutChartData(selectedSector)} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
                  </div>
                </div>
                <p className="text-center text-gray-700 mt-4">
                    Total Voter Turnout: <span className="font-bold text-2xl text-green-600">{selectedSector.lokSabha.voterTurnout}%</span>
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4">Rajya Sabha Seats</h3>
                <div className="h-64">
                  <Bar options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Rajya Sabha Seats by Party' } } }} data={getRajyaSabhaChartData(selectedSector)} />
                </div>
                <div className="mt-4">
                  <ul className="space-y-2">
                    {Object.entries(selectedSector.rajyaSabha.results).map(([party, data]) => (
                      <li key={party} className="flex justify-between items-center p-3 rounded-md shadow-sm bg-purple-100">
                        <span className="font-medium text-gray-700">{party}</span>
                        <span className="font-bold text-xl text-purple-800">{data.seats} Seat(s)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Overall Summary Dashboard */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-inner mb-10">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Overall Maharashtra Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                
                {/* Total Lok Sabha Seats Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border-b-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-600">Lok Sabha Seats</h3>
                  <div className="mt-4">
                    {Object.entries(overallSummary.lokSabhaSeats).map(([party, seats]) => (
                      <p key={party} className="text-2xl font-bold text-gray-800">
                        {party}: <span className="text-blue-600">{seats}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Total Rajya Sabha Seats Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border-b-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-gray-600">Rajya Sabha Seats</h3>
                  <div className="mt-4">
                    {Object.entries(overallSummary.rajyaSabhaSeats).map(([party, seats]) => (
                      <p key={party} className="text-2xl font-bold text-gray-800">
                        {party}: <span className="text-purple-600">{seats}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Average Voter Turnout Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border-b-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-600">Average Voter Turnout</h3>
                  <p className="text-5xl font-bold text-green-600 mt-4">{overallSummary.averageTurnout}%</p>
                </div>

                {/* Overall Winner Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border-b-4 border-yellow-500">
                  <h3 className="text-lg font-semibold text-gray-600">Lok Sabha Winner</h3>
                  <p className="text-3xl font-bold text-yellow-600 mt-4">{overallSummary.lokSabhaWinningParty}</p>
                </div>

              </div>
            </div>

            {/* Existing Grid view of all sectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {maharashtraSectors.map((sector) => (
                <div
                  key={sector.id}
                  onClick={() => handleSectorClick(sector)}
                  className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out border border-gray-200"
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
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Results;