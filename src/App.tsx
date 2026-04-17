import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="h-screen w-full bg-geo-bg text-geo-text p-0 sm:p-4 font-sans overflow-hidden flex flex-col items-center justify-center box-border">
      <div className="w-full max-w-[1024px] h-full max-h-[768px] border-[4px] border-geo-border grid grid-cols-1 lg:grid-cols-[280px_1fr_240px] grid-rows-[auto_1fr_auto] lg:grid-rows-[1fr_100px] bg-geo-bg">
        
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col border-r border-geo-border bg-geo-card p-6 overflow-y-auto gap-5">
          <div>
            <div className="text-[10px] uppercase tracking-[2px] text-geo-magenta font-bold mb-3">Controls</div>
            <div className="text-geo-dim flex flex-col gap-2">
               <div className="flex bg-white/5 p-3 border border-geo-border items-center gap-3">
                  <span className="font-mono text-geo-text text-sm">WASD</span>
                  <p className="text-xs">Navigate Node</p>
               </div>
               <div className="flex bg-white/5 p-3 border border-geo-border items-center gap-3">
                  <span className="font-mono text-geo-text text-sm">SPACE</span>
                  <p className="text-xs">Restart System</p>
               </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="text-[10px] uppercase tracking-[2px] text-geo-magenta font-bold mb-3">Global High Scores</div>
            <div className="flex flex-col gap-2 opacity-60">
              <div className="flex justify-between items-center py-1">
                <span className="text-xs">1. SYSTEM_ADMIN</span>
                <span className="text-geo-lime text-xs">12,450</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs">2. GHOST_IN_SHELL</span>
                <span className="text-geo-lime text-xs">11,200</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Main Stage */}
        <main className="relative flex flex-col items-center justify-center p-5 bg-[radial-gradient(circle_at_center,#111_0%,#050505_100%)] h-full overflow-hidden">
          <SnakeGame onScoreChange={setScore} />
          
          <div className="flex gap-10 mt-5">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[2px] text-geo-magenta font-bold mb-1">Current Score</div>
              <div className="font-mono text-[32px] text-geo-lime drop-shadow-[0_0_10px_#39ff14]">
                {score.toString().padStart(3, '0')}
              </div>
            </div>
          </div>
        </main>

        {/* Right Stats Panel */}
        <aside className="hidden lg:flex flex-col border-l border-geo-border bg-geo-card p-6">
          <div className="text-[10px] uppercase tracking-[2px] text-geo-magenta font-bold mb-3">System Monitor</div>
          <div className="space-y-4 text-xs text-geo-dim flex flex-col mb-10">
            <div className="flex justify-between pb-2 border-b border-geo-border">
              <span>CPU_USAGE</span>
              <span className="text-geo-cyan">42%</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-geo-border">
              <span>MEMORY</span>
              <span className="text-geo-lime">1.2TB</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-geo-border">
              <span>CONNECTION</span>
              <span className="text-geo-cyan drop-shadow-[0_0_5px_#00f3ff]">SECURE</span>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[2px] text-geo-magenta font-bold mb-3 mt-auto">Frequency Trace</div>
          <div className="h-[120px] flex items-end gap-1 my-5">
            {[40, 70, 90, 50, 30, 60, 80, 40].map((h, i) => (
              <div key={i} className="flex-1 min-h-[5px] bg-geo-magenta" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </aside>

        {/* Bottom Playback Bar */}
        <footer className="col-span-1 lg:col-span-3 bg-black border-t-[2px] border-geo-cyan overflow-hidden flex">
          <MusicPlayer />
        </footer>
        
      </div>
    </div>
  );
}
