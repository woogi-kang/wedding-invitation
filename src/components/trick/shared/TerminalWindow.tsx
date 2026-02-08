'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function TerminalWindow({
  title = 'terminal',
  children,
  className = '',
}: TerminalWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`rounded-lg border border-[#00ff41]/30 bg-black/80 backdrop-blur-sm overflow-hidden ${className}`}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#00ff41]/20 bg-black/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-xs text-[#00ff41]/60 font-mono">{title}</span>
      </div>

      {/* Terminal Content */}
      <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm text-[#00ff41]">
        {children}
      </div>
    </motion.div>
  );
}
