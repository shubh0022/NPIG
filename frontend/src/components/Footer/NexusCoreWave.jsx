import React from 'react';
import { motion } from 'framer-motion';

export default function NexusCoreWave({ active = true }) {
  // Waveform bars
  const bars = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    initialHeight: 4 + Math.random() * 12,
    duration: 0.6 + Math.random() * 0.8,
  }));

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-950/40 rounded-2xl border border-cyan-500/10 shadow-inner w-full max-w-xs relative overflow-hidden group">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500" />

      {/* Futuristic Orbit/Core Ring */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        {/* Outer glowing pulsing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-cyan-400/20"
        />

        {/* Medium pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-20 h-20 rounded-full border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        />

        {/* Core glowing orb */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)] border border-cyan-300 relative z-10"
        >
          <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center p-0.5 overflow-hidden">
            <img src="/npig-logo.png" alt="Nexus NPIG" className="w-full h-full object-contain drop-shadow" />
          </div>
        </motion.div>
      </div>

      {/* Voice Assistant Indicator Waveform */}
      <div className="flex items-end justify-center gap-1.5 h-16 w-full px-6 mb-3">
        {bars.map((bar) => (
          <motion.div
            key={bar.id}
            animate={
              active
                ? {
                    height: [
                      `${bar.initialHeight}px`,
                      `${bar.initialHeight * 3.5 > 56 ? 56 : bar.initialHeight * 3.5}px`,
                      `${bar.initialHeight}px`,
                    ],
                  }
                : { height: '6px' }
            }
            transition={{
              duration: bar.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1.5 rounded-full bg-gradient-to-t from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
            style={{ height: `${bar.initialHeight}px` }}
          />
        ))}
      </div>

      {/* Live Status indicator */}
      <div className="flex items-center gap-2 mb-1">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
          Nexus AI Active
        </span>
      </div>
      <span className="text-[10px] text-slate-500 font-mono">
        Hz Frequency: Stable (98.6%)
      </span>
    </div>
  );
}
