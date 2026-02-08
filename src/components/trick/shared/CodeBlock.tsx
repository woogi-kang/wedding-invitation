'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: string;
  typingSpeed?: number;
  showLineNumbers?: boolean;
  className?: string;
  onComplete?: () => void;
}

// Simple syntax highlighting
function highlightCode(code: string, language: string): string {
  if (language === 'yaml') {
    return code
      .replace(/^(\s*)(#.*)$/gm, '$1<span class="text-[#6a9955]">$2</span>')
      .replace(/^(\s*)([a-zA-Z_]+):/gm, '$1<span class="text-[#9cdcfe]">$2</span>:')
      .replace(/"([^"]*)"/g, '<span class="text-[#ce9178]">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-[#b5cea8]">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-[#569cd6]">$1</span>');
  }

  if (language === 'typescript' || language === 'ts') {
    return code
      .replace(/\/\/(.*)/g, '<span class="text-[#6a9955]">//$1</span>')
      .replace(/\b(const|let|var|function|export|import|from|async|await|interface|type)\b/g,
        '<span class="text-[#569cd6]">$1</span>')
      .replace(/\b(string|number|boolean|void|null|undefined)\b/g,
        '<span class="text-[#4ec9b0]">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="text-[#ce9178]">"$1"</span>')
      .replace(/'([^']*)'/g, '<span class="text-[#ce9178]">\'$1\'</span>');
  }

  if (language === 'json') {
    return code
      .replace(/"([^"]+)":/g, '<span class="text-[#9cdcfe]">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="text-[#ce9178]">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-[#b5cea8]">$1</span>')
      .replace(/: (true|false|null)/g, ': <span class="text-[#569cd6]">$1</span>');
  }

  return code;
}

export function CodeBlock({
  code,
  language = 'typescript',
  typingSpeed = 0,
  showLineNumbers = true,
  className = '',
  onComplete,
}: CodeBlockProps) {
  const [displayedCode, setDisplayedCode] = useState(typingSpeed > 0 ? '' : code);
  const [isComplete, setIsComplete] = useState(typingSpeed === 0);
  const indexRef = useRef(0);

  useEffect(() => {
    if (typingSpeed === 0) {
      setDisplayedCode(code);
      setIsComplete(true);
      return;
    }

    indexRef.current = 0;
    setDisplayedCode('');
    setIsComplete(false);

    const interval = setInterval(() => {
      if (indexRef.current < code.length) {
        setDisplayedCode(code.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [code, typingSpeed, onComplete]);

  const lines = displayedCode.split('\n');
  const highlightedLines = lines.map(line => highlightCode(line, language));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-[#1e1e1e] rounded-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="ml-2 text-xs text-gray-400 font-mono">
          {language === 'yaml' ? 'config.yaml' : language === 'json' ? 'package.json' : 'code.ts'}
        </span>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-[10px] sm:text-sm leading-relaxed">
          {highlightedLines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span className="select-none text-gray-600 w-8 text-right pr-4 flex-shrink-0">
                  {i + 1}
                </span>
              )}
              <code
                className="text-gray-300"
                dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
              />
            </div>
          ))}
          {!isComplete && (
            <span className="animate-pulse text-[#00ff41]">▊</span>
          )}
        </pre>
      </div>
    </motion.div>
  );
}
