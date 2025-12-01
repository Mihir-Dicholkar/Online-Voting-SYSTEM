import { maharashtraSectors } from "../data/maharashtraSectors";

export default function LiveElections() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Live Elections</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {maharashtraSectors.map((sector) => (
          <div key={sector.id} className="bg-white shadow p-4 rounded">
            <h2 className="font-semibold text-lg mb-2">{sector.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{sector.description}</p>
            <p className="text-sm"><strong>Voter Turnout:</strong> {sector.lokSabha.voterTurnout}%</p>
            <div className="mt-2">
              <strong>Live Vote Count:</strong>
              <ul className="ml-4">
                {Object.entries(sector.lokSabha.results).map(([party, data]) => (
                  <li key={party}>{party}: {data.votes.toLocaleString()}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
