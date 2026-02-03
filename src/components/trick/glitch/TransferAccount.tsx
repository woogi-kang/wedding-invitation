'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { WEDDING_INFO } from '@/lib/constants';
import { TerminalWindow } from '../shared/TerminalWindow';

type AccountSide = 'groom' | 'bride';

interface Account {
  bank: string;
  number: string;
  holder: string;
}

export function TransferAccount() {
  const [expandedSide, setExpandedSide] = useState<AccountSide | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const { groom, bride } = WEDDING_INFO;

  const accounts: Record<AccountSide, { label: string; color: string; accounts: Account[] }> = {
    groom: {
      label: '신랑측',
      color: '#00d4ff',
      accounts: [groom.account, groom.fatherAccount, groom.motherAccount],
    },
    bride: {
      label: '신부측',
      color: '#ff0080',
      accounts: [bride.account, bride.fatherAccount, bride.motherAccount],
    },
  };

  const copyToClipboard = async (account: Account) => {
    const text = `${account.bank} ${account.number} ${account.holder}`;
    await navigator.clipboard.writeText(account.number);
    setCopiedAccount(text);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

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
            $ bank.transfer()
          </span>
          <h2 className="text-2xl font-bold text-[#00ff41] mt-2">
            Send Blessings
          </h2>
        </motion.div>

        <TerminalWindow title="bank_transfer.ts">
          <div className="space-y-4">
            {/* Function signature */}
            <div className="font-mono text-sm text-[#00ff41]/70">
              <span className="text-[#569cd6]">async function</span>{' '}
              <span className="text-[#dcdcaa]">sendBlessings</span>
              <span className="text-white">(</span>
              <span className="text-[#9cdcfe]">to</span>
              <span className="text-white">: </span>
              <span className="text-[#4ec9b0]">Account</span>
              <span className="text-white">)</span>
            </div>

            {/* Account Sections */}
            {(Object.entries(accounts) as [AccountSide, typeof accounts.groom][]).map(
              ([side, data]) => (
                <motion.div
                  key={side}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border rounded"
                  style={{ borderColor: `${data.color}30` }}
                >
                  {/* Toggle Header */}
                  <button
                    onClick={() => setExpandedSide(expandedSide === side ? null : side)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-mono text-sm" style={{ color: data.color }}>
                      // {data.label} accounts
                    </span>
                    <motion.div
                      animate={{ rotate: expandedSide === side ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" style={{ color: data.color }} />
                    </motion.div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedSide === side && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          {data.accounts.map((account, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center justify-between p-3 bg-black/30 rounded border"
                              style={{ borderColor: `${data.color}20` }}
                            >
                              <div className="font-mono text-xs space-y-1">
                                <div className="text-white/80">{account.holder}</div>
                                <div style={{ color: data.color }}>
                                  {account.bank} {account.number}
                                </div>
                              </div>
                              <button
                                onClick={() => copyToClipboard(account)}
                                className="p-2 rounded hover:bg-white/10 transition-colors"
                              >
                                {copiedAccount === `${account.bank} ${account.number} ${account.holder}` ? (
                                  <Check className="w-4 h-4 text-[#00ff41]" />
                                ) : (
                                  <Copy className="w-4 h-4" style={{ color: data.color }} />
                                )}
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            )}

            {/* Success message */}
            <AnimatePresence>
              {copiedAccount && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center font-mono text-xs text-[#00ff41]"
                >
                  ✓ Account number copied to clipboard
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
