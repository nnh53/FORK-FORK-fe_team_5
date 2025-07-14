import React from "react";
import { MyMovieHistory } from "./MovieHistory";

// Test component để kiểm tra MovieHistory với API thực
export const MovieHistoryTest: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Test Movie History Component</h2>
      <MyMovieHistory />
    </div>
  );
};

export default MovieHistoryTest;
