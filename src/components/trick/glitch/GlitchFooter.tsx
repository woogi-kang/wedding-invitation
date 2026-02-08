'use client';

import { motion } from 'framer-motion';
import { useTripleTap } from '@/hooks/useKonamiCode';
import { useTrickRouter } from '@/hooks/useTrickRouter';
import { WEDDING_INFO } from '@/lib/constants';
import Link from 'next/link';

export function GlitchFooter() {
  const { navigateToArcade } = useTrickRouter();
  const { handleTap } = useTripleTap(navigateToArcade);

  return (
    <footer className="py-8 sm:py-12 px-4 border-t border-[#00ff41]/20">
      <div className="max-w-2xl mx-auto text-center">
        {/* ASCII Art Heart */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 overflow-x-auto"
        >
          <pre className="font-mono text-[#ff0080] text-[8px] sm:text-xs leading-tight inline-block">
{`██╗      ██████╗ ██╗   ██╗███████╗
██║     ██╔═══██╗██║   ██║██╔════╝
██║     ██║   ██║██║   ██║█████╗
██║     ██║   ██║╚██╗ ██╔╝██╔══╝
███████╗╚██████╔╝ ╚████╔╝ ███████╗
╚══════╝ ╚═════╝   ╚═══╝  ╚══════╝`}
          </pre>
        </motion.div>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[#00ff41] mb-4"
        >
          {WEDDING_INFO.groom.name} ♥ {WEDDING_INFO.bride.name}
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-[#00ff41]/60 text-sm mb-8"
        >
          {WEDDING_INFO.dateDisplay.year}.
          {String(WEDDING_INFO.dateDisplay.month).padStart(2, '0')}.
          {String(WEDDING_INFO.dateDisplay.day).padStart(2, '0')}
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 sm:gap-4 mb-8"
        >
          <Link
            href="/invitation"
            className="font-mono text-xs text-[#00d4ff] hover:underline"
          >
            [일반 초대장]
          </Link>
          <Link
            href="/invitation/arcade"
            className="font-mono text-xs text-[#ffff00] hover:underline"
          >
            [ARCADE 버전]
          </Link>
        </motion.div>

        {/* Easter Egg Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="font-mono text-[#00ff41]/30 text-xs"
          onClick={handleTap}
        >
          // Made with ♥ and lots of ☕
          <br />
          // Tap here 3x for arcade mode
        </motion.div>

        {/* Version */}
        <div className="mt-4 font-mono text-[#00ff41]/20 text-xs">
          v1.0.0-glitch // {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
