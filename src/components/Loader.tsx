export const Loading = () => (
    <div className="w-full h-full flex items-center justify-center overflow-x-hidden border-b-4">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gray-500"></div>
        <div className="text-gray-500 mt-4">Loading...</div>
      </div>
    </div>
  );
  