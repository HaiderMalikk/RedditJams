interface ResultsViewProps {
  data: any;
  onReset: () => void;
}

export default function ResultsView({ data, onReset }: ResultsViewProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-black">
          Your Recommendations
        </h2>
        <button
          onClick={onReset}
          className="bg-primary rounded-lg px-6 py-2 font-semibold text-white transition-colors hover:bg-[#E63D00]"
        >
          Try Another Playlist
        </button>
      </div>

      <div className="rounded-lg border-2 border-black bg-white p-8 shadow-lg">
        <h3 className="text-primary mb-4 text-xl font-bold">
          Response Data (JSON):
        </h3>
        <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
