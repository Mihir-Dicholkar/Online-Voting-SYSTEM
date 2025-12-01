import { maharashtraSectors } from "../data/maharashtraSectors";

export default function DeclareResults() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Declare Results</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {maharashtraSectors.map((sector) => {
          const winner = Object.entries(sector.lokSabha.results).find(([_, data]) => data.winner)?.[0];
          return (
            <div key={sector.id} className="bg-white shadow p-4 rounded">
              <h2 className="font-semibold text-lg">{sector.name}</h2>
              <p className="text-sm text-gray-600">{sector.description}</p>
              <div className="mt-2">
                <p><strong>Winner:</strong> <span className="text-green-600 font-bold">{winner}</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
