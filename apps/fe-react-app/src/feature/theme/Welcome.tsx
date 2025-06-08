import React from 'react'

const Welcome = () => {
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

export default Welcome