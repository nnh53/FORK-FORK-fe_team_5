// // components/SignUp.tsx
// import React, { useState, type FormEvent } from 'react';
// import { supaClient } from '../libs/supabase'; // Adjust path as needed

// interface SignUpProps {
//   onSignUpSuccess?: (email: string) => void; // Callback with email for confirmation message
//   onSwitchToLogin?: () => void;
// }

// const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [confirmPassword, setConfirmPassword] = useState<string>('');
//   // Optional: Add more fields like username, full name if you want to collect them at sign-up
//   // const [username, setUsername] = useState<string>('');

//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setError(null);
//     setMessage(null);

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//     if (password.length < 6) { // Supabase default minimum password length
//         setError("Password should be at least 6 characters long.");
//         return;
//     }

//     setLoading(true);

//     try {
//       const { data, error: authError } = await supaClient.auth.signUp({
//         email: email,
//         password: password,
//         // options: { // Optional: if you want to pass data to be stored in raw_user_meta_data or raw_app_meta_data
//         //   data: {
//         //     username: username, // if collecting username
//         //     // full_name: 'Initial Full Name',
//         //   }
//         // }
//       });

//       if (authError) {
//         setError(authError.message);
//         console.error('Sign up error:', authError);
//       } else if (data.user) {
//         // Check if email confirmation is required (Supabase default)
//         if (data.user.identities && data.user.identities.length > 0 && !data.user.email_confirmed_at) {
//             setMessage(`Sign up successful! Please check ${data.user.email} to confirm your email address.`);
//         } else {
//             setMessage("Sign up successful! You can now log in."); // For cases where email confirmation might be off or auto-confirmed
//         }
//         if (onSignUpSuccess) {
//           onSignUpSuccess(data.user.email || email);
//         }
//       } else {
//         // This case might happen if email confirmation is disabled and sign-up is immediate.
//         // Or if there's an unexpected response structure.
//         setMessage("Sign up process initiated. If email confirmation is enabled, please check your email.");
//         if (onSignUpSuccess) {
//             onSignUpSuccess(email);
//           }
//       }
//     } catch (catchedError: any) {
//       setError("An unexpected error occurred. Please try again.");
//       console.error('Catched sign up error:', catchedError);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-3xl font-bold text-center text-gray-900">
//           Create Account
//         </h2>
//         <form onSubmit={handleSignUp} className="space-y-6">
//           {error && (
//             <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md" role="alert">
//               {error}
//             </div>
//           )}
//           {message && (
//             <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md" role="alert">
//               {message}
//             </div>
//           )}

//           {/* Optional: Username field
//           <div>
//             <label
//               htmlFor="username"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Username
//             </label>
//             <div className="mt-1">
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 autoComplete="username"
//                 required
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 disabled={loading}
//                 className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>
//           */}

//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email address
//             </label>
//             <div className="mt-1">
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//                 className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <div className="mt-1">
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="new-password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading}
//                 className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 aria-describedby="password-help"
//               />
//                <p className="mt-1 text-xs text-gray-500" id="password-help">
//                 Password must be at least 6 characters long.
//               </p>
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="confirm-password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Confirm Password
//             </label>
//             <div className="mt-1">
//               <input
//                 id="confirm-password"
//                 name="confirm-password"
//                 type="password"
//                 autoComplete="new-password"
//                 required
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 disabled={loading}
//                 className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Creating account...' : 'Sign Up'}
//             </button>
//           </div>
//         </form>

//         {onSwitchToLogin && (
//           <p className="mt-6 text-sm text-center text-gray-600">
//             Already have an account?{' '}
//             <button
//               onClick={onSwitchToLogin}
//               className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
//             >
//               Login
//             </button>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SignUp;
import React, { useState, type FormEvent } from 'react';
import { supaClient } from '../libs/supabase'; // Adjust path as needed

interface SignUpProps {
  onSignUpSuccess?: (email: string) => void;
  onSwitchToLogin?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // New fields for user_detail (via app_metadata for the trigger)
  const [fullName, setFullName] = useState<string>(''); // Assuming you'll add this to user_detail via trigger
  const [dateOfBirth, setDateOfBirth] = useState<string>(''); // Input type="date" gives YYYY-MM-DD

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
  
    if (!dateOfBirth) {
      setError("Date of birth is required.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supaClient.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { // This will be available as NEW.raw_app_meta_data in your trigger
            full_name: fullName.trim(),
            date_of_birth: dateOfBirth, // e.g., "1990-05-15"
            // role: 'CUSTOMER' // You can explicitly set it, or let the trigger default it
          }
        }
      });

      if (authError) {
        setError(authError.message);
        console.error('Sign up error:', authError);
      } else if (data.user) {
        if (data.user.identities && data.user.identities.length > 0 && !data.user.email_confirmed_at) {
          setMessage(`Sign up successful! Please check ${data.user.email} to confirm your email address.`);
        } else {
          setMessage("Sign up successful! You can now log in.");
        }
        if (onSignUpSuccess) {
          onSignUpSuccess(data.user.email || email);
        }
        // Optionally clear form fields
        setEmail(''); setPassword(''); setConfirmPassword('');
        setFullName(''); setDateOfBirth('');
      } else {
        setMessage("Sign up process initiated. If email confirmation is enabled, please check your email.");
        if (onSignUpSuccess) {
          onSignUpSuccess(email);
        }
      }
    } catch (catchedError: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error('Catched sign up error:', catchedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-50 sm:py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Create Account
        </h2>
        <form onSubmit={handleSignUp} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md" role="alert">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1">
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

        

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="mt-1">
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date" // This input type helps with date format
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disabled={loading}
                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="password-help"
              />
              <p className="mt-1 text-xs text-gray-500" id="password-help">
                Password must be at least 6 characters long.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {onSwitchToLogin && (
          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;