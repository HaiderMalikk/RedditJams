import Image from "next/image";

export default function LoadingView() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-20">
      <div className="text-center">
        <div className="mb-8 inline-block">
          <div className="animate-spin" style={{ animationDuration: "1.5s" }}>
            <Image
              src="/logo.svg"
              alt="Loading..."
              width={150}
              height={150}
              className="h-[150px] w-[150px]"
            />
          </div>
        </div>
        <h2 className="mb-4 text-3xl font-bold text-black">
          Analyzing Your Playlist...
        </h2>
        <p className="text-gray-600">
          This may take a moment while we search Reddit and generate
          recommendations
        </p>
      </div>
    </div>
  );
}
