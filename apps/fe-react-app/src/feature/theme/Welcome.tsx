import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Welcome = () => {
  const { isLoggedIn, user, authLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = async () => {
    await authLogout();
    navigate('/login');
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800">Welcome, {user.username}!</h1>
        <p className="mb-2 text-gray-600">User ID: {user.id}</p>
        <p className="mb-2 text-gray-600">Role: {user.roles.join(', ')}</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Welcome;
