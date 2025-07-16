import React from "react";

// Error boundary component for better error handling
function SpotlightErrorBoundary({ children }: { children: React.ReactNode }) {
  return <div className="error-boundary">{children}</div>;
}

export default SpotlightErrorBoundary;
