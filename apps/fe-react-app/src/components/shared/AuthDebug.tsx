import { useAuth } from "@/hooks/useAuth";
import React from "react";

const AuthDebug: React.FC = () => {
  const { isLoggedIn, user } = useAuth();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Auth Debug Info:</h4>
      <div>
        <strong>Is Logged In:</strong> {isLoggedIn ? "Yes" : "No"}
      </div>
      {user && (
        <>
          <div>
            <strong>User ID:</strong> {user.id}
          </div>
          <div>
            <strong>Full Name:</strong> {user.fullName}
          </div>
          <div>
            <strong>Roles:</strong> {user.roles.join(", ")}
          </div>
          <div>
            <strong>Token:</strong> {user.token ? "Present" : "Missing"}
          </div>
        </>
      )}
    </div>
  );
};

export default AuthDebug;
