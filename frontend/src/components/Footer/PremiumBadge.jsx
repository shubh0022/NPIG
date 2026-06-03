import React from 'react';
import { motion } from 'framer-motion';

export default function PremiumBadge({ title, description, icon }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02, borderColor: 'rgba(255,255,255,0.15)' }}
      className="relative flex flex-col items-center justify-center p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden group w-full text-center"
    >
      {/* Light metallic sweep reflection */}
      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />

      {/* Futuristic glowing badge backdrop */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="w-12 h-12 rounded-full bg-slate-900/60 border border-white/10 flex items-center justify-center text-xl mb-3 text-cyan-400 group-hover:text-white transition-colors duration-300 relative shadow-inner">
        {icon}
      </div>

      <h4 className="text-white text-sm font-extrabold tracking-wider mb-1 font-display">
        {title}
      </h4>
      <p className="text-[10px] text-slate-500 font-mono tracking-tight uppercase">
        {description}
      </p>
    </motion.div>
  );
}
