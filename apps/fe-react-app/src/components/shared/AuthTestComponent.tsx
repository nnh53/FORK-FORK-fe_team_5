import { useAuth } from "@/hooks/useAuth";
import { getCookie } from "@/utils/cookie.utils";
import { Link } from "react-router-dom";

const AuthTestComponent = () => {
  const { user, isLoggedIn, authLogin, authLogout } = useAuth();

  const simulateMemberLogin = () => {
    // Simulate a MEMBER login for testing
    authLogin({
      token: "fake-member-token-123",
      roles: ["MEMBER"],
      id: 1,
      fullName: "Test Member User",
      refresh_token: "fake-refresh-token",
    });
  };

  const simulateAdminLogin = () => {
    // Simulate an ADMIN login for testing
    authLogin({
      token: "fake-admin-token-123",
      roles: ["ADMIN"],
      id: 2,
      fullName: "Test Admin User",
      refresh_token: "fake-admin-refresh-token",
    });
  };

  const currentRoles = getCookie("user_roles");

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Authentication Test Panel</h2>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current Auth Status:</h3>
        <p>
          <strong>Logged In:</strong> {isLoggedIn ? "Yes" : "No"}
        </p>
        <p>
          <strong>User:</strong> {user?.fullName || "None"}
        </p>
        <p>
          <strong>Roles:</strong> {currentRoles || "None"}
        </p>
        <p>
          <strong>Token:</strong> {getCookie("access_token") ? "Present" : "None"}
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <h3 className="font-semibold">Test Authentication:</h3>
        <button onClick={simulateMemberLogin} className="mr-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login as MEMBER
        </button>
        <button onClick={simulateAdminLogin} className="mr-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Login as ADMIN
        </button>
        <button onClick={authLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="mb-6 space-y-2">
        <h3 className="font-semibold">Test Access Links:</h3>
        <div className="space-y-2">
          <Link to="/admin" className="block w-fit px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">
            Try Access /admin (ADMIN only)
          </Link>
          <Link to="/staff" className="block w-fit px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600">
            Try Access /staff (STAFF only)
          </Link>
          <Link to="/account" className="block w-fit px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600">
            Try Access /account (MEMBER only)
          </Link>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <h4 className="font-semibold mb-2">Test Scenarios:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Login as MEMBER → Try to access /admin → Should redirect to /unauthorized</li>
          <li>Login as ADMIN → Try to access /admin → Should access admin dashboard</li>
          <li>No login → Try to access any protected route → Should redirect to /auth/login</li>
        </ol>
      </div>
    </div>
  );
};

export default AuthTestComponent;
