'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { WEDDING_INFO } from '@/lib/constants';
import { ARCADE_COLORS } from './shared/RetroText';
import type { GalleryImage } from '@/lib/gallery';

// -- Types --

type BuildingId = 'castle' | 'shop' | 'inn' | 'trophy' | 'guild';
type PartyTab = 'groom' | 'bride';

interface AccountInfo {
  bank: string;
  number: string;
  holder: string;
}

interface BuildingConfig {
  id: BuildingId;
  icon: string;
  title: string;
  subtitle: string;
  iconColor: string;
}

// -- Constants --

const BUILDINGS: BuildingConfig[] = [
  { id: 'castle', icon: '\u{1F3F0}', title: 'CASTLE', subtitle: 'Event Location', iconColor: ARCADE_COLORS.gold },
  { id: 'shop', icon: '\u{1F3E6}', title: 'ITEM SHOP', subtitle: 'Gold Transfer', iconColor: ARCADE_COLORS.green },
  { id: 'inn', icon: '\u{1F3E8}', title: 'INN', subtitle: 'Fast Travel Points', iconColor: ARCADE_COLORS.blue },
  { id: 'trophy', icon: '\u{1F3C6}', title: 'TROPHY ROOM', subtitle: 'Memory Collection', iconColor: ARCADE_COLORS.pink },
  { id: 'guild', icon: '\u{1F4DC}', title: 'GUILD BOARD', subtitle: 'Guest Messages', iconColor: ARCADE_COLORS.gold },
];

const PIXEL_BORDER_SHADOW = `4px 4px 0 ${ARCADE_COLORS.gray}, -4px -4px 0 ${ARCADE_COLORS.gray}, 4px -4px 0 ${ARCADE_COLORS.gray}, -4px 4px 0 ${ARCADE_COLORS.gray}`;

// -- Sub-components --

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.9 }}
      className="px-2 py-1 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] shrink-0"
      style={{
        color: copied ? ARCADE_COLORS.green : ARCADE_COLORS.gold,
        background: copied ? `${ARCADE_COLORS.green}20` : `${ARCADE_COLORS.gold}20`,
        border: `1px solid ${copied ? ARCADE_COLORS.green : ARCADE_COLORS.gold}60`,
        transition: 'all 0.2s',
      }}
      aria-label={`Copy account number ${text}`}
    >
      {copied ? 'OK!' : 'COPY'}
    </motion.button>
  );
}

function AccountRow({ account }: { account: AccountInfo }) {
  return (
    <div
      className="flex flex-col gap-1 p-2 mb-1.5"
      style={{
        background: `${ARCADE_COLORS.bgLight}80`,
        border: `1px solid ${ARCADE_COLORS.gray}30`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
          style={{ color: ARCADE_COLORS.blue }}
        >
          [{account.bank}]
        </span>
        <CopyButton text={account.number} />
      </div>
      <span
        className="text-[14px] sm:text-[16px] tracking-wide"
        style={{ color: ARCADE_COLORS.text, fontFamily: 'monospace' }}
      >
        {account.number}
      </span>
      <span
        className="text-[13px] sm:text-[14px]"
        style={{ color: ARCADE_COLORS.gray }}
      >
        {account.holder}
      </span>
    </div>
  );
}

function TransportSection({ title, content, color }: { title: string; content: string; color: string }) {
  const lines = content.split('\n');
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-1.5 h-1.5 inline-block"
          style={{ background: color }}
        />
        <span
          className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px]"
          style={{ color }}
        >
          {title}
        </span>
      </div>
      {lines.map((line, i) => (
        <p
          key={i}
          className="text-[13px] sm:text-[14px] leading-[21px] sm:leading-[23px] ml-3.5"
          style={{ color: ARCADE_COLORS.text }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

// -- Building Content Renderers --

function CastleContent() {
  const { dateDisplay, venue } = WEDDING_INFO;

  return (
    <div>
      {/* Date and Time */}
      <div className="mb-3 pb-3" style={{ borderBottom: `1px dashed ${ARCADE_COLORS.gray}40` }}>
        <p
          className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px] mb-1"
          style={{ color: ARCADE_COLORS.gold }}
        >
          DATE
        </p>
        <p className="text-[16px] sm:text-[17px]" style={{ color: ARCADE_COLORS.text }}>
          {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}. {String(dateDisplay.day).padStart(2, '0')} ({dateDisplay.dayOfWeek})
        </p>
        <p className="text-[16px] sm:text-[17px] mt-0.5" style={{ color: ARCADE_COLORS.text }}>
          {dateDisplay.time}
        </p>
      </div>

      {/* Venue */}
      <div className="mb-3 pb-3" style={{ borderBottom: `1px dashed ${ARCADE_COLORS.gray}40` }}>
        <p
          className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px] mb-1"
          style={{ color: ARCADE_COLORS.gold }}
        >
          VENUE
        </p>
        <p className="text-[16px] sm:text-[17px] font-bold" style={{ color: ARCADE_COLORS.text }}>
          {venue.name}
        </p>
        <p className="text-[14px] sm:text-[16px] mt-0.5" style={{ color: ARCADE_COLORS.pink }}>
          {venue.hall}
        </p>
        <p className="text-[13px] sm:text-[14px] mt-1" style={{ color: ARCADE_COLORS.gray }}>
          {venue.address}
        </p>
        <p className="text-[13px] sm:text-[14px] mt-0.5" style={{ color: ARCADE_COLORS.gray }}>
          Tel. {venue.tel}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col gap-2">
        <p
          className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px] mb-0.5"
          style={{ color: ARCADE_COLORS.gold }}
        >
          NAVIGATE
        </p>
        <div className="grid grid-cols-3 gap-2">
          <NavButton
            label="Naver"
            color={ARCADE_COLORS.green}
            href={venue.navigation.naver}
          />
          <NavButton
            label="Kakao"
            color={ARCADE_COLORS.gold}
            href={venue.navigation.kakao}
          />
          <NavButton
            label="Tmap"
            color={ARCADE_COLORS.blue}
            href={venue.navigation.tmap}
          />
        </div>
      </div>
    </div>
  );
}

function NavButton({ label, color, href }: { label: string; color: string; href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center py-2 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
      style={{
        color: '#000',
        background: color,
        border: `2px solid ${color}`,
        boxShadow: `2px 2px 0 ${ARCADE_COLORS.darkGray}`,
      }}
      aria-label={`Open ${label} Map`}
    >
      {label}
    </motion.a>
  );
}

function ShopContent() {
  const [activeTab, setActiveTab] = useState<PartyTab>('groom');

  const groomAccounts: AccountInfo[] = [
    WEDDING_INFO.groom.account,
    WEDDING_INFO.groom.fatherAccount,
    WEDDING_INFO.groom.motherAccount,
  ];

  const brideAccounts: AccountInfo[] = [
    WEDDING_INFO.bride.account,
    WEDDING_INFO.bride.fatherAccount,
    WEDDING_INFO.bride.motherAccount,
  ];

  const accounts = activeTab === 'groom' ? groomAccounts : brideAccounts;

  return (
    <div>
      {/* Tabs */}
      <div className="flex mb-3">
        <button
          onClick={() => setActiveTab('groom')}
          className="flex-1 py-2 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] transition-colors"
          style={{
            color: activeTab === 'groom' ? '#000' : ARCADE_COLORS.blue,
            background: activeTab === 'groom' ? ARCADE_COLORS.blue : 'transparent',
            border: `2px solid ${ARCADE_COLORS.blue}`,
            borderRight: 'none',
          }}
          aria-pressed={activeTab === 'groom'}
        >
          GROOM
        </button>
        <button
          onClick={() => setActiveTab('bride')}
          className="flex-1 py-2 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] transition-colors"
          style={{
            color: activeTab === 'bride' ? '#000' : ARCADE_COLORS.pink,
            background: activeTab === 'bride' ? ARCADE_COLORS.pink : 'transparent',
            border: `2px solid ${ARCADE_COLORS.pink}`,
          }}
          aria-pressed={activeTab === 'bride'}
        >
          BRIDE
        </button>
      </div>

      {/* Party label */}
      <p
        className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] mb-2"
        style={{ color: activeTab === 'groom' ? ARCADE_COLORS.blue : ARCADE_COLORS.pink }}
      >
        {activeTab === 'groom' ? "Groom's Party" : "Bride's Party"}
      </p>

      {/* Account list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'groom' ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'groom' ? 10 : -10 }}
          transition={{ duration: 0.2 }}
        >
          {accounts.map((account, i) => (
            <AccountRow key={`${activeTab}-${i}`} account={account} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function InnContent() {
  const { venue, shuttle } = WEDDING_INFO;

  return (
    <div>
      <TransportSection
        title="Subway"
        content={venue.subway}
        color={ARCADE_COLORS.green}
      />
      <TransportSection
        title="Bus"
        content={venue.bus}
        color={ARCADE_COLORS.blue}
      />
      <TransportSection
        title="Parking"
        content={venue.parking}
        color={ARCADE_COLORS.gold}
      />
      {shuttle?.available && shuttle.routes.length > 0 && (
        <TransportSection
          title="Shuttle"
          content={shuttle.routes.map(r =>
            `${r.departure}\n${r.timeStart}~${r.timeEnd} (${r.interval} 간격)\n${r.duration}`
          ).join('\n')}
          color={ARCADE_COLORS.pink}
        />
      )}
    </div>
  );
}

function TrophyContent({ galleryImages }: { galleryImages: GalleryImage[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (galleryImages.length === 0) {
    return (
      <p className="text-center py-4 font-['Press_Start_2P',monospace] text-[9px]" style={{ color: ARCADE_COLORS.gray }}>
        No photos collected yet...
      </p>
    );
  }

  return (
    <div>
      {/* Image grid */}
      <div className="grid grid-cols-3 gap-2">
        {galleryImages.map((img, i) => (
          <motion.button
            key={img.src}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLightboxIdx(i)}
            className="relative aspect-square overflow-hidden"
            style={{
              border: `2px solid ${ARCADE_COLORS.gray}`,
              boxShadow: `2px 2px 0 ${ARCADE_COLORS.darkGray}`,
            }}
            aria-label={`View ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={200}
              height={200}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'auto' }}
            />
            {/* COLLECTED badge */}
            <span
              className="absolute bottom-0 left-0 right-0 py-0.5 text-center font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px]"
              style={{
                color: ARCADE_COLORS.gold,
                background: 'rgba(0, 0, 0, 0.75)',
              }}
            >
              COLLECTED
            </span>
          </motion.button>
        ))}
      </div>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.92)' }}
            onClick={() => setLightboxIdx(null)}
            role="dialog"
            aria-label="Image viewer"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-lg w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[lightboxIdx].src}
                alt={galleryImages[lightboxIdx].alt}
                width={800}
                height={1000}
                className="w-full h-auto object-contain max-h-[75vh]"
              />
              {/* Close button */}
              <button
                onClick={() => setLightboxIdx(null)}
                className="absolute -top-10 right-0 font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px] px-3 py-1"
                style={{
                  color: ARCADE_COLORS.text,
                  background: `${ARCADE_COLORS.red}80`,
                  border: `2px solid ${ARCADE_COLORS.red}`,
                }}
                aria-label="Close image viewer"
              >
                X
              </button>
              {/* Navigation arrows */}
              {lightboxIdx > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 font-['Press_Start_2P',monospace] text-[16px] sm:text-[20px] p-2"
                  style={{ color: ARCADE_COLORS.text, textShadow: '0 0 8px rgba(0,0,0,0.8)' }}
                  aria-label="Previous image"
                >
                  {'\u25C0'}
                </button>
              )}
              {lightboxIdx < galleryImages.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 font-['Press_Start_2P',monospace] text-[16px] sm:text-[20px] p-2"
                  style={{ color: ARCADE_COLORS.text, textShadow: '0 0 8px rgba(0,0,0,0.8)' }}
                  aria-label="Next image"
                >
                  {'\u25B6'}
                </button>
              )}
              {/* Counter */}
              <p
                className="text-center mt-2 font-['Press_Start_2P',monospace] text-[10px]"
                style={{ color: ARCADE_COLORS.gray }}
              >
                {lightboxIdx + 1} / {galleryImages.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -- Guild Board (방명록) --

const GUILD_BOARD_KEY = 'wedding_arcade_guildboard';

interface GuildMessage {
  id: string;
  name: string;
  text: string;
  timestamp: number;
}

function loadGuildMessages(): GuildMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUILD_BOARD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveGuildMessages(msgs: GuildMessage[]): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(GUILD_BOARD_KEY, JSON.stringify(msgs)); } catch { /* ignore */ }
}

function GuildBoardContent() {
  const [messages, setMessages] = useState<GuildMessage[]>(() => loadGuildMessages());
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = useCallback(() => {
    const trimName = name.trim() || 'Adventurer';
    const trimText = text.trim();
    if (!trimText) return;

    const newMsg: GuildMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimName,
      text: trimText,
      timestamp: Date.now(),
    };
    const updated = [newMsg, ...messages].slice(0, 20);
    setMessages(updated);
    saveGuildMessages(updated);
    setText('');
  }, [name, text, messages]);

  return (
    <div>
      {/* 입력 영역 */}
      <div className="mb-3 pb-3" style={{ borderBottom: `1px dashed ${ARCADE_COLORS.gray}40` }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          className="w-full px-2 py-1.5 mb-2 font-['Press_Start_2P',monospace] text-[10px] sm:text-[11px] outline-none"
          style={{
            background: ARCADE_COLORS.darkGray,
            color: ARCADE_COLORS.text,
            border: `1px solid ${ARCADE_COLORS.gray}60`,
          }}
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Leave a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={60}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            className="flex-1 px-2 py-1.5 font-['Press_Start_2P',monospace] text-[10px] sm:text-[11px] outline-none"
            style={{
              background: ARCADE_COLORS.darkGray,
              color: ARCADE_COLORS.text,
              border: `1px solid ${ARCADE_COLORS.gray}60`,
            }}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSubmit}
            className="px-3 py-1.5 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] shrink-0"
            style={{
              color: '#000',
              background: ARCADE_COLORS.gold,
              border: `2px solid ${ARCADE_COLORS.gold}`,
              boxShadow: `2px 2px 0 ${ARCADE_COLORS.darkGray}`,
            }}
          >
            POST
          </motion.button>
        </div>
      </div>

      {/* 메시지 목록 */}
      {messages.length === 0 ? (
        <p
          className="text-center py-4 font-['Press_Start_2P',monospace] text-[9px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          No messages yet...
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-2"
              style={{
                background: `${ARCADE_COLORS.bgLight}80`,
                border: `1px solid ${ARCADE_COLORS.gray}30`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
                  style={{ color: ARCADE_COLORS.gold }}
                >
                  {msg.name}
                </span>
                <span
                  className="font-['Press_Start_2P',monospace] text-[7px]"
                  style={{ color: ARCADE_COLORS.gray }}
                >
                  {new Date(msg.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p
                className="text-[12px] sm:text-[13px] leading-[18px]"
                style={{ color: ARCADE_COLORS.text }}
              >
                {msg.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -- Main Component --

interface PostGameVillageProps {
  onNavigate?: (path: string) => void;
  galleryImages?: GalleryImage[];
}

export function PostGameVillage({ onNavigate, galleryImages = [] }: PostGameVillageProps) {
  const [expandedBuilding, setExpandedBuilding] = useState<BuildingId | null>(null);

  const toggleBuilding = useCallback((id: BuildingId) => {
    setExpandedBuilding((prev) => (prev === id ? null : id));
  }, []);

  const renderBuildingContent = (id: BuildingId) => {
    switch (id) {
      case 'castle':
        return <CastleContent />;
      case 'shop':
        return <ShopContent />;
      case 'inn':
        return <InnContent />;
      case 'trophy':
        return <TrophyContent galleryImages={galleryImages} />;
      case 'guild':
        return <GuildBoardContent />;
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center overflow-hidden"
      style={{ background: ARCADE_COLORS.bg }}
    >
      {/* Ambient pixel stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px]"
            style={{
              background: ARCADE_COLORS.text,
              top: `${(i * 37 + 13) % 100}%`,
              left: `${(i * 53 + 7) % 100}%`,
              opacity: 0.3,
            }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-6 pb-2 sm:pt-8 sm:pb-4 px-4 relative z-10"
      >
        <motion.p
          className="font-['Press_Start_2P',monospace] text-[18px] sm:text-[24px] lg:text-[22px]"
          style={{
            color: ARCADE_COLORS.gold,
            textShadow: `0 0 12px ${ARCADE_COLORS.gold}50, 0 2px 0 #b38f00`,
          }}
          animate={{ textShadow: [
            `0 0 12px ${ARCADE_COLORS.gold}50, 0 2px 0 #b38f00`,
            `0 0 20px ${ARCADE_COLORS.gold}80, 0 2px 0 #b38f00`,
            `0 0 12px ${ARCADE_COLORS.gold}50, 0 2px 0 #b38f00`,
          ]}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          SKY GARDEN VILLAGE
        </motion.p>
        <p
          className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] mt-2 max-w-xs mx-auto leading-[18px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          Welcome, Adventurer!
        </p>
        <p
          className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px] mt-1 max-w-xs mx-auto leading-[16px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          The wedding quest info desk awaits.
        </p>
      </motion.div>

      {/* Building grid */}
      <div className="w-full max-w-2xl px-4 py-4 sm:px-6 sm:py-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {BUILDINGS.map((building, idx) => {
            const isExpanded = expandedBuilding === building.id;

            return (
              <motion.div
                key={building.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                layout
                className="w-full"
              >
                {/* Building card */}
                <motion.button
                  onClick={() => toggleBuilding(building.id)}
                  whileHover={{ scale: 1.02 }}
                  className="w-full text-left p-3 sm:p-4 cursor-pointer relative"
                  style={{
                    background: isExpanded
                      ? `linear-gradient(180deg, ${ARCADE_COLORS.bgLight} 0%, ${ARCADE_COLORS.bg} 100%)`
                      : ARCADE_COLORS.bg,
                    boxShadow: isExpanded
                      ? `4px 4px 0 ${ARCADE_COLORS.gold}80, -4px -4px 0 ${ARCADE_COLORS.gold}80, 4px -4px 0 ${ARCADE_COLORS.gold}80, -4px 4px 0 ${ARCADE_COLORS.gold}80, 0 0 16px ${ARCADE_COLORS.gold}20`
                      : PIXEL_BORDER_SHADOW,
                    transition: 'box-shadow 0.3s',
                    imageRendering: 'pixelated' as const,
                  }}
                  aria-expanded={isExpanded}
                  aria-controls={`building-content-${building.id}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <span className="text-[24px] sm:text-[28px]" role="img" aria-hidden="true">
                      {building.icon}
                    </span>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px]"
                        style={{ color: ARCADE_COLORS.gold }}
                      >
                        {building.title}
                      </p>
                      <p
                        className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px] mt-1"
                        style={{ color: ARCADE_COLORS.gray }}
                      >
                        {building.subtitle}
                      </p>
                    </div>
                    {/* Expand indicator */}
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px]"
                      style={{ color: isExpanded ? ARCADE_COLORS.gold : ARCADE_COLORS.gray }}
                    >
                      {'\u25BC'}
                    </motion.span>
                  </div>
                </motion.button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={`building-content-${building.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div
                        className="p-3 sm:p-4 mt-1"
                        style={{
                          background: `${ARCADE_COLORS.bgLight}60`,
                          borderLeft: `2px solid ${building.iconColor}40`,
                          borderRight: `2px solid ${building.iconColor}40`,
                          borderBottom: `2px solid ${building.iconColor}40`,
                        }}
                      >
                        {renderBuildingContent(building.id)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-2xl px-4 pb-8 sm:px-6 sm:pb-10 relative z-10"
      >
        <div
          className="flex flex-col items-center gap-3 pt-4"
          style={{ borderTop: `1px dashed ${ARCADE_COLORS.gray}40` }}
        >
          <p
            className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
            style={{ color: ARCADE_COLORS.gray }}
          >
            WARP ZONE
          </p>
          <div className="flex gap-3">
            {onNavigate ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('/invitation')}
                  className="px-4 py-2 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
                  style={{
                    color: ARCADE_COLORS.text,
                    background: 'transparent',
                    border: `2px solid ${ARCADE_COLORS.gray}`,
                    boxShadow: `2px 2px 0 ${ARCADE_COLORS.darkGray}`,
                  }}
                >
                  Normal Ver.
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('/invitation/glitch')}
                  className="px-4 py-2 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
                  style={{
                    color: ARCADE_COLORS.green,
                    background: 'transparent',
                    border: `2px solid ${ARCADE_COLORS.green}60`,
                    boxShadow: `2px 2px 0 ${ARCADE_COLORS.darkGray}`,
                  }}
                >
                  Glitch Ver.
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  href="/invitation"
                  className="px-4 py-2 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] inline-block"
                  style={{
                    color: ARCADE_COLORS.text,
                    background: 'transparent',
                    border: `2px solid ${ARCADE_COLORS.gray}`,
                    boxShadow: `2px 2px 0 ${ARCADE_COLORS.darkGray}`,
                  }}
                >
                  Normal Ver.
                </Link>
                <Link
                  href="/invitation/glitch"
                  className="px-4 py-2 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] inline-block"
                  style={{
                    color: ARCADE_COLORS.green,
                    background: 'transparent',
                    border: `2px solid ${ARCADE_COLORS.green}60`,
                    boxShadow: `2px 2px 0 ${ARCADE_COLORS.darkGray}`,
                  }}
                >
                  Glitch Ver.
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
