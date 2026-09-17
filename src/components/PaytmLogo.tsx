import React from 'react';
import { Sparkles } from 'lucide-react';

interface PaytmLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const PaytmLogo: React.FC<PaytmLogoProps> = ({ 
  size = 'md', 
  showTagline = true 
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Dynamic Geometric Brand Glyph */}
      <div 
        className={`relative rounded-2xl p-0.5 bg-gradient-to-br from-[#00baf2] via-[#0081c9] to-[#002970] shadow-lg shadow-cyan-500/25 flex items-center justify-center shrink-0 overflow-hidden ${
          isSm ? 'w-8 h-8 rounded-xl' : isLg ? 'w-12 h-12 rounded-2xl' : 'w-10 h-10'
        }`}
      >
        {/* Subtle internal gloss */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 pointer-events-none"></div>
        
        {/* Custom SVG Monogram */}
        <svg 
          viewBox="0 0 36 36" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`${isSm ? 'w-6 h-6' : isLg ? 'w-9 h-9' : 'w-7 h-7'}`}
        >
          {/* Stylized P loop & CashFlow Arrow wave */}
          <path 
            d="M9 7C9 5.89543 9.89543 5 11 5H19.5C24.1944 5 28 8.80558 28 13.5C28 18.1944 24.1944 22 19.5 22H15V29C15 30.1046 14.1046 31 13 31H11C9.89543 31 9 30.1046 9 29V7Z" 
            fill="#ffffff" 
          />
          <path 
            d="M15 11H19.5C20.8807 11 22 12.1193 22 13.5C22 14.8807 20.8807 16 19.5 16H15V11Z" 
            fill="#002970" 
          />
          {/* AI Flow Curve node in cyan */}
          <path 
            d="M23 20C26.5 22 28.5 25.5 29 29C29.2 30.2 28.2 31 27 31C24 31 21.5 28.5 20.5 25C20 23.5 21.2 21 23 20Z" 
            fill="#00baf2" 
          />
          <circle cx="28" cy="9" r="2.5" fill="#38bdf8" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <div className="flex items-baseline font-black tracking-tight text-white">
            <span className={`${isSm ? 'text-base' : isLg ? 'text-2xl' : 'text-lg'} text-white font-black tracking-tight`}>
              Paytm
            </span>
            <span className={`${isSm ? 'text-base' : isLg ? 'text-2xl' : 'text-lg'} font-bold ml-1 text-slate-200`}>
              CashFlow
            </span>
          </div>

          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs shadow-cyan-500/40 tracking-wider">
            AI
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] font-semibold text-cyan-400 tracking-wider uppercase">
              Predict. Explain. Plan.
            </span>
            <span className="text-slate-600 text-[10px]">•</span>
            <span className="text-[10px] text-slate-400 font-medium">Copilot</span>
          </div>
        )}
      </div>
    </div>
  );
};
