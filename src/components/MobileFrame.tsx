import React, { useState, useEffect } from "react";
import { Wifi, Battery, Signal, Smartphone, Sun, Moon } from "lucide-react";

interface MobileFrameProps {
  children: React.ReactNode;
  cameraActive?: boolean;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export default function MobileFrame({ children, cameraActive = false, theme = "dark", onToggleTheme }: MobileFrameProps) {
  const [time, setTime] = useState("");
  const isLight = theme === "light";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center justify-center min-h-screen px-2 py-6 sm:px-4 transition-colors duration-200 ${
      isLight ? "bg-slate-205" : "bg-slate-900"
    }`}>
      {/* Outer Glow container */}
      <div className={`relative w-full max-w-[412px] h-[840px] rounded-[48px] shadow-2xl p-3 flex flex-col overflow-hidden select-none border-4 transition-all duration-200 ${
        isLight
          ? "bg-slate-300/80 border-slate-300 shadow-slate-300/30"
          : "bg-slate-950 border-slate-800 shadow-cyan-500/10"
      }`}>
        
        {/* Sleek Side Hardware Buttons (Visual details) */}
        <div className={`absolute right-[-6px] top-32 w-1.5 h-16 rounded-l-md pointer-events-none transition-colors duration-200 ${
          isLight ? "bg-slate-400" : "bg-slate-700"
        }`} />
        <div className={`absolute right-[-6px] top-56 w-1.5 h-12 rounded-l-md pointer-events-none transition-colors duration-200 ${
          isLight ? "bg-slate-400" : "bg-slate-700"
        }`} />
        <div className={`absolute left-[-6px] top-32 w-1.5 h-10 rounded-r-md pointer-events-none transition-colors duration-200 ${
          isLight ? "bg-slate-400" : "bg-slate-705"
        }`} />

        {/* Smartphone Screen Inner */}
        <div className={`relative flex-1 rounded-[38px] overflow-hidden flex flex-col border transition-colors duration-200 ${
          isLight ? "bg-slate-50 border-slate-200" : "bg-slate-100/10 border-slate-900"
        }`}>
          
          {/* Status Bar */}
          <div className={`h-10 flex items-center justify-between px-6 z-30 transition-colors duration-200 ${
            isLight ? "bg-white border-b border-slate-100" : "bg-slate-950"
          }`}>
            {/* Dynamic Time */}
            <span className={`text-xs font-semibold tracking-tight font-mono transition-colors duration-200 ${
              isLight ? "text-slate-800" : "text-slate-300"
            }`}>{time}</span>
            
            {/* Camera / Mic Notch & Camera active indicator indicator dot */}
            <div className={`absolute left-1/2 -translate-x-1/2 top-1.5 h-5 w-28 rounded-b-2xl flex items-center justify-center space-x-1.5 shadow-sm border-t-0 border transition-colors duration-250 ${
              isLight ? "bg-slate-100 border-slate-200/50" : "bg-black border-slate-900"
            }`}>
              <div className={`w-2 h-2 rounded-full transition-colors ${isLight ? "bg-slate-300" : "bg-slate-800"}`} /> {/* Speaker lens */}
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${cameraActive ? "bg-emerald-500 animate-pulse" : isLight ? "bg-slate-350" : "bg-cyan-900"}`} /> {/* Camera indicator */}
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isLight ? "bg-slate-400" : "bg-blue-900"}`} /> {/* Camera lens */}
            </div>

            {/* Smartphone Sensors / Day-Night mode toggle */}
            <div className="flex items-center space-x-2.5 z-40">
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className={`p-1 rounded-md transition-all duration-100 cursor-pointer active:scale-90 ${
                    isLight 
                      ? "hover:bg-slate-100 text-amber-500" 
                      : "hover:bg-slate-900 text-yellow-300"
                  }`}
                  title={isLight ? "Switch to Night Mode" : "Switch to Day Mode"}
                >
                  {isLight ? (
                    <Sun className="w-3.5 h-3.5 fill-amber-300" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 fill-yellow-300" />
                  )}
                </button>
              )}

              <div className={`flex items-center space-x-1 transition-colors duration-200 ${
                isLight ? "text-slate-600" : "text-slate-300"
              }`}>
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <div className="flex items-center space-x-0.5 animate-fadeIn">
                  <span className="text-[10px] font-mono font-medium">92%</span>
                  <Battery className="w-4 h-4 text-emerald-500 fill-emerald-500/30" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Screen View */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {children}
          </div>

          {/* Home Swipe Indicator (iPhone-style) */}
          <div className={`h-5 flex items-center justify-center pb-1.5 z-20 transition-colors duration-200 ${
            isLight ? "bg-white border-t border-slate-100/60" : "bg-slate-950"
          }`}>
            <div className={`w-28 h-1 rounded-full transition-colors duration-200 ${
              isLight ? "bg-slate-300" : "bg-slate-700"
            }`} />
          </div>

        </div>
      </div>
    </div>
  );
}
