interface ErrorViewProps {
  error: string;
  onReset: () => void;
}

export default function ErrorView({ error, onReset }: ErrorViewProps) {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <div className="text-primary mb-4 text-6xl">⚠️</div>
          <h2 className="mb-4 text-3xl font-bold text-black">
            Oops! Something Went Wrong
          </h2>
        </div>

        <div className="mb-8 rounded-lg border-2 border-red-500 bg-red-50 p-6">
          <p className="text-lg text-red-700">{error}</p>
        </div>

        <button
          onClick={onReset}
          className="bg-primary rounded-lg px-8 py-4 font-semibold text-white transition-colors hover:bg-[#E63D00]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
