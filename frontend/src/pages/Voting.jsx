import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';


// --- Mock Data (Based on User's Request) ---

const MAHARASHTRA_SECTORS = [
    {
      id: 'mumbai-north',
      name: 'Mumbai North',
      electionType: 'Lok Sabha',
      date: 'Currently Polling (Phase 3)',
      status: 'Live',
      lokSabha: {
        totalVotes: 1250000,
        voterTurnout: 65,
        results: {
          'Party A (IND)': { votes: 600000, winner: true, color: 'bg-green-600' },
          'Party B (INC)': { votes: 450000, winner: false, color: 'bg-red-600' },
          'Party C (SHS)': { votes: 200000, winner: false, color: 'bg-yellow-600' },
        },
      },
      description: 'Key metropolitan constituency with diverse demographics.',
    },
    {
      id: 'pune',
      name: 'Pune',
      electionType: 'Lok Sabha',
      date: 'Polls Concluded',
      status: 'Awaiting Result',
      lokSabha: {
        totalVotes: 1500000,
        voterTurnout: 68,
        results: {
          'Party A (IND)': { votes: 550000, winner: false, color: 'bg-green-600' },
          'Party B (INC)': { votes: 700000, winner: true, color: 'bg-red-600' },
          'Party C (SHS)': { votes: 250000, winner: false, color: 'bg-yellow-600' },
        },
      },
      description: 'Educational and IT hub of Maharashtra.',
    },
    {
      id: 'nagpur',
      name: 'Nagpur',
      electionType: 'Lok Sabha',
      date: 'Result Declared',
      status: 'Completed',
      lokSabha: {
        totalVotes: 1100000,
        voterTurnout: 72,
        results: {
          'Party A (IND)': { votes: 580000, winner: true, color: 'bg-green-600' },
          'Party B (INC)': { votes: 400000, winner: false, color: 'bg-red-600' },
          'Party C (SHS)': { votes: 120000, winner: false, color: 'bg-yellow-600' },
        },
      },
      description: 'Winter capital and a major political center.',
    },
    {
      id: 'nashik',
      name: 'Nashik',
      electionType: 'Lok Sabha',
      date: 'Currently Polling (Phase 3)',
      status: 'Live',
      lokSabha: {
        totalVotes: 1050000,
        voterTurnout: 63,
        results: {
          'Party A (IND)': { votes: 300000, winner: false, color: 'bg-green-600' },
          'Party B (INC)': { votes: 350000, winner: false, color: 'bg-red-600' },
          'Party C (SHS)': { votes: 400000, winner: true, color: 'bg-yellow-600' },
        },
      },
      description: 'Known for its vineyards and religious significance.',
    },
];

const UPCOMING_ELECTIONS = [
    { id: 'asm-by', name: 'State Assembly By-Election: Karjat', date: 'December 15, 2025', status: 'Scheduled', description: 'Filling vacancy for MLA seat.', type: 'State Assembly' },
    { id: 'mcp-pune', name: 'Municipal Corporation Polls: Pune & PCMC', date: 'January 28, 2026', status: 'Scheduled', description: 'Local body elections across Pune Metropolitan Region.', type: 'Local Body' },
    { id: 'rajya', name: 'Rajya Sabha Bye-Poll', date: 'TBD (Early 2026)', status: 'Pending Announcement', description: 'Indirect election for a vacant Rajya Sabha seat.', type: 'Rajya Sabha' },
];

// --- Helper Components ---

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
    // State to hold the current tab view: 'current' or 'upcoming'
    const [activeTab, setActiveTab] = useState('current');
    // State to manage which district card is expanded
    const [expandedSectorId, setExpandedSectorId] = useState(null);
    // State to track if a vote has been cast for a sector: { 'mumbai-north': 'Party A (IND)', 'pune': 'Party B (INC)' }
    const [voteStatus, setVoteStatus] = useState({});
    // State for the success modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Toggle expansion of a sector card
    const toggleExpansion = (id) => {
        setExpandedSectorId(id === expandedSectorId ? null : id);
    };

    // Function to handle the simulated vote submission
    const handleVote = (sectorId, partyName) => {
        // Prevent action if already voted in this sector
        if (voteStatus[sectorId]) return;

        // 1. Update vote status
        setVoteStatus(prevStatus => ({
            ...prevStatus,
            [sectorId]: partyName
        }));

        // 2. Show success message
        setModalMessage(`Your vote for "${partyName}" in ${MAHARASHTRA_SECTORS.find(s => s.id === sectorId)?.name} has been stored successfully!`);
        setShowSuccessModal(true);

        // 3. Close expanded view after voting
        setExpandedSectorId(null);
    };

    // Calculate total votes for a sector to find vote percentages
    const totalLokSabhaVotes = useMemo(() => 
        MAHARASHTRA_SECTORS.reduce((sum, sector) => sum + sector.lokSabha.totalVotes, 0), 
        []
    );

    // Component to render the current/recent election data cards
    const renderCurrentElections = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MAHARASHTRA_SECTORS.map((sector) => {
                const isExpanded = sector.id === expandedSectorId;
                const lokSabhaData = sector.lokSabha;
                const hasVoted = !!voteStatus[sector.id];
                const statusColor = {
                    'Live': 'bg-red-500',
                    'Awaiting Result': 'bg-yellow-500',
                    'Completed': 'bg-green-500',
                }[sector.status] || 'bg-gray-500';

                return (
                    <div
                        key={sector.id}
                        className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border ${hasVoted ? 'border-green-400' : 'border-gray-100'}`}
                    >
                        {/* Header Section */}
                        <div className="p-5 bg-indigo-50 border-b border-indigo-100">
                            <h3 className="text-xl font-bold text-indigo-800 flex justify-between items-start">
                                {sector.name} ({sector.electionType})
                                <span className={`text-xs font-semibold py-1 px-3 rounded-full text-white ${statusColor}`}>
                                    {sector.status}
                                </span>
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{sector.date}</p>
                            {hasVoted && (
                                <p className="mt-2 text-green-700 font-semibold text-sm">
                                    <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M5 13l4 4L19 7"></path></svg>
                                    Voted for: {voteStatus[sector.id]}
                                </p>
                            )}
                        </div>

                        {/* Summary Metrics */}
                        <div className="p-5 grid grid-cols-2 gap-4" onClick={() => toggleExpansion(sector.id)}>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Voter Turnout</p>
                                <p className="text-2xl font-extrabold text-indigo-700">{lokSabhaData.voterTurnout}%</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Votes Polled</p>
                                <p className="text-xl font-bold text-gray-700">{lokSabhaData.totalVotes.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm font-medium text-gray-500">Total Share (of all districts)</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                    <div 
                                        className="h-2.5 rounded-full bg-amber-500" 
                                        style={{ width: `${(lokSabhaData.totalVotes / totalLokSabhaVotes * 100).toFixed(2)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {(lokSabhaData.totalVotes / totalLokSabhaVotes * 100).toFixed(2)}% of total votes tracked
                                </p>
                            </div>
                        </div>

                        {/* Expand Details Button */}
                        <div 
                            className="p-4 flex justify-between items-center text-indigo-600 hover:bg-indigo-50 transition duration-150 cursor-pointer border-t"
                            onClick={() => toggleExpansion(sector.id)}
                        >
                            <span className="font-semibold text-sm">
                                {isExpanded ? 'Hide Details' : hasVoted ? 'View Results Only' : 'Cast Your Vote / View Details'}
                            </span>
                            <ChevronIcon expanded={isExpanded} />
                        </div>

                        {/* Detailed Results & Voting Interface */}
                        {isExpanded && (
                            <div className="p-5 border-t border-indigo-100 bg-gray-50">
                                <h4 className="font-bold text-lg mb-3 text-indigo-700">Lok Sabha Candidate Results</h4>
                                {Object.entries(lokSabhaData.results)
                                    .sort(([, a], [, b]) => b.votes - a.votes)
                                    .map(([party, data]) => {
                                        const percentage = ((data.votes / lokSabhaData.totalVotes) * 100).toFixed(1);
                                        const isMyVote = voteStatus[sector.id] === party;

                                        return (
                                            <div key={party} className="mb-3">
                                                <div className="flex justify-between items-center text-sm font-medium">
                                                    <span className={`flex items-center ${data.winner ? 'text-green-700 font-bold' : 'text-gray-700'} ${isMyVote ? 'border-2 border-indigo-500 px-1 py-0.5 rounded' : ''}`}>
                                                        {data.winner && (
                                                            <svg className="w-4 h-4 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                        {party}
                                                    </span>
                                                    <span className="font-semibold text-gray-800">{percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                                    <div className={`h-2.5 rounded-full ${data.color}`} style={{ width: `${percentage}%` }}></div>
                                                </div>
                                                <span className="text-xs text-gray-500 block mt-1">{data.votes.toLocaleString('en-IN')} votes</span>

                                                {/* Voting Button */}
                                                {!hasVoted && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleVote(sector.id, party); }}
                                                        className={`mt-2 w-full text-center py-1 rounded-lg text-sm font-semibold transition duration-150 
                                                            ${(sector.status === 'Live' || sector.status === 'Awaiting Result') ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                                                        disabled={sector.status === 'Completed' || sector.status === 'Awaiting Result'}
                                                    >
                                                        {sector.status === 'Live' ? `Vote for ${party.split(' ')[0]}` : 'Voting Closed'}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })
                                }
                                
                                <p className="text-sm mt-4 text-gray-600 italic border-t pt-3">{sector.description}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    // Component to render the upcoming election schedule
    const renderUpcomingElections = () => (
        <div className="space-y-4">
            {UPCOMING_ELECTIONS.map((election) => (
                <div key={election.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500 flex justify-between items-center transition duration-200 hover:shadow-lg">
                    <div className="flex-grow">
                        <h4 className="text-xl font-bold text-indigo-800">{election.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{election.description}</p>
                    </div>
                    <div className="text-right ml-4">
                        <p className="text-lg font-extrabold text-amber-600">{election.date}</p>
                        <span className="text-xs font-semibold px-2 py-0.5 mt-1 inline-block rounded-full bg-indigo-200 text-indigo-800">
                            {election.type}
                        </span>
                    </div>
                </div>
            ))}
            <div className="text-center p-6 bg-indigo-50 rounded-lg mt-6">
                <p className="text-indigo-700 font-semibold">
                    <svg className="w-5 h-5 inline-block mr-2 align-text-bottom" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Future election dates are provisional and subject to change by the Election Commission.
                </p>
            </div>
        </div>
    );

    // Tab button style helper
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
                {/* Hero Section */}
                <section className="text-center py-10 bg-indigo-700 rounded-xl shadow-xl mb-8">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                        Maharashtra Election Watch
                    </h2>
                    <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
                        Track current election progress and participate in our simulated online vote.
                    </p>
                </section>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={getTabClasses('current')}
                        onClick={() => setActiveTab('current')}
                    >
                        Current/Recent Lok Sabha Elections
                    </button>
                    <button
                        className={getTabClasses('upcoming')}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Elections Schedule
                    </button>
                </div>

                {/* Content Area */}
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
