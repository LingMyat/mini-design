'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, Cpu, Globe, Moon, Sun } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [time, setTime] = useState<string>('');
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#090a0f]" />;
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#090a0f] text-zinc-100' : 'bg-[#fafafa] text-zinc-800'
    }`}>
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[120px] transition-opacity ${
          isDark ? 'bg-indigo-600/10' : 'bg-indigo-300/20'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[120px] transition-opacity ${
          isDark ? 'bg-purple-600/10' : 'bg-purple-300/20'
        }`} />
      </div>

      {/* Minimal Top Bar */}
      <header className="px-8 py-6 flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            M
          </div>
          <span className="font-semibold text-sm tracking-tight">Mochi Labs</span>
        </div>

        <div className="flex items-center gap-4">
          <div className={`text-xs font-mono px-3 py-1 rounded-full border transition ${
            isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'
          }`}>
            {time || '00:00:00'} UTC
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl border transition ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600 hover:text-black shadow-sm'
            }`}
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="max-w-3xl mx-auto px-6 py-20 text-center flex flex-col items-center z-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border transition ${
          isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Design Systems & Experimental Engineering</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Crafting digital clarity through form & code.
        </h1>

        <p className={`mt-5 text-sm sm:text-base max-w-xl leading-relaxed ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          An independent research & interface studio exploring high-fidelity interactions, procedural generative media, and fluid computational aesthetics.
        </p>

        {/* Abstract Studio Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full text-left">
          <div className={`p-5 rounded-2xl border transition ${
            isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/90 shadow-sm'
          }`}>
            <Compass className="w-5 h-5 text-indigo-500 mb-2" />
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Architecture</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Modular design tokens, spatial layouts, and coherent aesthetic frameworks.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition ${
            isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/90 shadow-sm'
          }`}>
            <Cpu className="w-5 h-5 text-purple-500 mb-2" />
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Performance</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Sub-millisecond reactivity, sandboxed renders, and zero latency interfaces.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition ${
            isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200/90 shadow-sm'
          }`}>
            <Globe className="w-5 h-5 text-sky-500 mb-2" />
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Distributed</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Edge-distributed deployment with decentralized asset delivery.
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className={`border-t py-6 text-center text-xs transition-colors z-10 ${
        isDark ? 'border-zinc-900 text-zinc-600' : 'border-zinc-200 text-zinc-400'
      }`}>
        <div className="flex items-center justify-center gap-4">
          <span>© 2026 Mochi Labs</span>
          <span>·</span>
          <span>Tokyo · Singapore · Yangon</span>
          <span>·</span>
          <span>All systems operational</span>
        </div>
      </footer>
    </div>
  );
}
