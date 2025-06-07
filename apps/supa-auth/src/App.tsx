// App.tsx (or wherever you manage auth state)
import React, { useState, useEffect } from 'react';
import { supaClient } from './libs/supabase'; // Adjust path
import Login from './components/Login'; // Adjust path
import SignUp from './components/SignUp'; // Adjust path
import type { Session, User } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [authMessage, setAuthMessage] = useState<string | null>(null); // For post-signup message

  useEffect(() => {
    supaClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supaClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (_event === 'SIGNED_IN') { // Clear any previous auth message on new sign-in
            setAuthMessage(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supaClient.auth.signOut();
    if (error) console.error('Error logging out:', error);
    setAuthMessage(null); // Clear message on logout
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Display auth message if any (e.g., after signup)
  if (authMessage && (!session || !user)) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
                <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md" role="alert">
                    {authMessage}
                </div>
                <button
                    onClick={() => {
                        setAuthMessage(null);
                        setShowLogin(true); // Go back to login view
                    }}
                    className="px-4 py-2 mt-4 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
  }


  if (!session || !user) {
    return showLogin ? (
      <Login
        onLoginSuccess={() => {
            console.log("Login successful from App!");
            setAuthMessage(null); // Clear any previous message
        }}
        onSwitchToSignUp={() => {
            setShowLogin(false);
            setAuthMessage(null); // Clear any previous message
        }}
      />
    ) : (
      <SignUp
        onSignUpSuccess={(email) => {
          console.log(`Sign up successful for ${email}! Check email for confirmation.`);
          // Set a message to display to the user
          setAuthMessage(`Please check ${email} to confirm your email address before logging in.`);
          // Optionally, automatically switch to login or stay on a page showing the message
          // setShowLogin(true); // Or handle with the authMessage display
        }}
        onSwitchToLogin={() => {
            setShowLogin(true);
            setAuthMessage(null); // Clear any previous message
        }}
      />
    );
  }

  // User is logged in
  return (
    <div className="container p-4 mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800">
          Welcome, {user.email}!
        </h1>
        <p className="mb-2 text-gray-600">User ID: {user.id}</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      {/* Your protected app content here */}
    </div>
  );
};

export default App;