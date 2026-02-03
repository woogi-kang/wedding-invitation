'use client';

import { motion } from 'framer-motion';
import { toGitLog } from '@/lib/trick-content';
import { TerminalWindow } from '../shared/TerminalWindow';

export function GitLogTimeline() {
  const commits = toGitLog();

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[#00ff41]/60 font-mono text-xs tracking-widest">
            $ git log --oneline --graph
          </span>
          <h2 className="text-2xl font-bold text-[#00ff41] mt-2">
            Our Timeline
          </h2>
        </motion.div>

        {/* Git Log Output */}
        <TerminalWindow title="git-log">
          <div className="space-y-1">
            {commits.map((commit, index) => (
              <motion.div
                key={commit.hash}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 font-mono text-sm"
              >
                {/* Graph line */}
                <span className="text-[#ff0080]">*</span>

                {/* Commit hash */}
                <span className="text-[#ffff00]">{commit.hash}</span>

                {/* HEAD indicator */}
                {commit.isHead && (
                  <span className="text-[#00d4ff]">(HEAD -&gt; main)</span>
                )}

                {/* Commit message */}
                <span className="text-[#00ff41]">
                  {commit.message} {commit.emoji}
                </span>
              </motion.div>
            ))}

            {/* Branch info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: commits.length * 0.1 + 0.2 }}
              className="mt-4 pt-4 border-t border-[#00ff41]/20"
            >
              <div className="text-[#00ff41]/60 text-xs">
                <div>Branch: <span className="text-[#00d4ff]">main</span></div>
                <div>Remote: <span className="text-[#ff0080]">origin/love</span></div>
                <div>Status: <span className="text-[#00ff41]">FOREVER_COMMITTED</span></div>
              </div>
            </motion.div>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
