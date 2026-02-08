'use client';

import { motion } from 'framer-motion';
import { CodeBlock } from '../shared/CodeBlock';
import { toYaml, toPackageJson } from '@/lib/trick-content';
import { useState } from 'react';

type ViewMode = 'yaml' | 'json';

export function ConfigYamlInfo() {
  const [viewMode, setViewMode] = useState<ViewMode>('yaml');

  const yamlContent = toYaml();
  const jsonContent = toPackageJson();

  return (
    <section className="py-10 sm:py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[#00ff41]/60 font-mono text-xs tracking-widest">
            $ cat wedding.config
          </span>
          <h2 className="text-2xl font-bold text-[#00ff41] mt-2">
            Wedding Info
          </h2>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mb-4"
        >
          <button
            onClick={() => setViewMode('yaml')}
            className={`px-4 py-2 font-mono text-sm rounded transition-colors ${
              viewMode === 'yaml'
                ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/50'
                : 'bg-transparent text-[#00ff41]/50 border border-[#00ff41]/20 hover:border-[#00ff41]/40'
            }`}
          >
            config.yaml
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-4 py-2 font-mono text-sm rounded transition-colors ${
              viewMode === 'json'
                ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/50'
                : 'bg-transparent text-[#00ff41]/50 border border-[#00ff41]/20 hover:border-[#00ff41]/40'
            }`}
          >
            package.json
          </button>
        </motion.div>

        {/* Code Block */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CodeBlock
            code={viewMode === 'yaml' ? yamlContent : jsonContent}
            language={viewMode}
            showLineNumbers
          />
        </motion.div>

        {/* Copy Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-4 text-center"
        >
          <button
            onClick={() => {
              navigator.clipboard.writeText(viewMode === 'yaml' ? yamlContent : jsonContent);
            }}
            className="px-4 py-2 font-mono text-xs text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
          >
            [CTRL+C] Copy to clipboard
          </button>
        </motion.div>
      </div>
    </section>
  );
}
