import { useState, type JSX } from 'react';
import { users } from '../data/users';

export default function Login(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (): void => {
    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser) {
      setError('Invalid email or password');
      return;
    }

    localStorage.setItem('statera-user', JSON.stringify(matchedUser));
    setError('');
    alert(`Signed in as ${matchedUser.name}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col px-6">
      
      {/* Brand */}
      <div className="pt-8">
        <div className="text-2xl font-black tracking-tight text-slate-900">
          STATERA
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
          
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-400">
                Please enter your details
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>
            </div>

            {/* Fields */}
            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700">
                  Email address
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 rounded-lg border border-slate-200 px-4 text-base text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700">
                  Password
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 rounded-lg border border-slate-200 px-4 text-base text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full h-14 rounded-lg bg-blue-500 text-base font-semibold text-white transition hover:bg-blue-600 active:scale-[0.98]"
            >
              Sign in
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}