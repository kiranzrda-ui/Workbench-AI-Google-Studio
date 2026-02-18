
import React, { useState, useEffect } from 'react';

interface GatekeeperProps {
  onUnlock: () => void;
}

const Gatekeeper: React.FC<GatekeeperProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * SECURITY CONFIGURATION
   */
  const SECRET_PREFIX = "tunga-"; 

  const getDailyKey = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${SECRET_PREFIX}${day}${month}`;
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = getDailyKey();
    
    if (passcode.toLowerCase() === expected) {
      setIsAnimating(true);
      setTimeout(() => {
        onUnlock();
      }, 800);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPasscode('');
    }
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50 transition-all duration-1000 ${isAnimating ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative w-full max-w-md p-8 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-purple-500 flex items-center justify-center shadow-2xl shadow-purple-500/30 relative">
            <span className="text-3xl font-bold text-white">C</span>
            <div className="absolute inset-0 rounded-2xl border border-white/40 animate-ping opacity-30"></div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Access Terminal</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Enter the daily synchronization key to access the <br /> 
          <span className="text-purple-600 font-semibold">Companion Model Workbench.</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative group">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-white border ${error ? 'border-rose-500 animate-shake' : 'border-slate-200 group-hover:border-slate-300'} rounded-2xl px-6 py-4 text-center text-xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-800 placeholder:text-slate-200 transition-all shadow-sm`}
              autoFocus
            />
            {error && (
              <p className="absolute -bottom-6 left-0 right-0 text-[10px] text-rose-500 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                Invalid Passcode Sequence
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] group flex items-center justify-center gap-2"
          >
            <span>Initialize Session</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </form>

        <div className="mt-12 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">
          Deterministic Daily Encryption Active
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}} />
    </div>
  );
};

export default Gatekeeper;
