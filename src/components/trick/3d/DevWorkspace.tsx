'use client';

import { FloatingObject } from './FloatingObject';
import { WEDDING_INFO } from '@/lib/constants';

export function DevWorkspace() {
  const { groom, bride, dateDisplay, venue } = WEDDING_INFO;

  return (
    <group>
      {/* Center - Wedding Info (Heart) */}
      <FloatingObject
        position={[0, 0, 0]}
        color="#ff0080"
        glowColor="#ff0080"
        label="LOVE.EXE"
        content={
          <div className="text-center">
            <div className="text-xl mb-2">
              {groom.name} ♥ {bride.name}
            </div>
            <div className="text-[#00ff41] text-xs">
              STATUS: FOREVER_COMMITTED
            </div>
          </div>
        }
      />

      {/* Calendar - Date */}
      <FloatingObject
        position={[-3, 1, -1]}
        color="#00d4ff"
        glowColor="#00d4ff"
        label="calendar.event"
        content={
          <div>
            <div className="text-lg font-bold mb-2">
              {dateDisplay.year}.{String(dateDisplay.month).padStart(2, '0')}.{String(dateDisplay.day).padStart(2, '0')}
            </div>
            <div className="text-[#00d4ff]">{dateDisplay.dayOfWeek}</div>
            <div className="text-[#ffff00]">{dateDisplay.time}</div>
          </div>
        }
      />

      {/* Location - Venue */}
      <FloatingObject
        position={[3, 1, -1]}
        color="#00ff41"
        glowColor="#00ff41"
        label="location.config"
        content={
          <div>
            <div className="font-bold mb-1">{venue.name}</div>
            <div className="text-[#00ff41] text-xs mb-2">{venue.hall}</div>
            <div className="text-gray-400 text-xs">{venue.address}</div>
            <div className="mt-2 text-[#ffff00] text-xs">
              [{venue.coordinates.lat}, {venue.coordinates.lng}]
            </div>
          </div>
        }
      />

      {/* Groom Info */}
      <FloatingObject
        position={[-2, -1, 2]}
        color="#5f8b9b"
        glowColor="#5f8b9b"
        label="groom.info"
        content={
          <div>
            <div className="text-lg font-bold">{groom.name}</div>
            <div className="text-gray-400 text-xs mb-2">{groom.englishName}</div>
            <div className="text-xs">
              <div>아버지: {groom.father}</div>
              <div>어머니: {groom.mother}</div>
            </div>
          </div>
        }
      />

      {/* Bride Info */}
      <FloatingObject
        position={[2, -1, 2]}
        color="#BB7273"
        glowColor="#BB7273"
        label="bride.info"
        content={
          <div>
            <div className="text-lg font-bold">{bride.name}</div>
            <div className="text-gray-400 text-xs mb-2">{bride.englishName}</div>
            <div className="text-xs">
              <div>아버지: {bride.father}</div>
              <div>어머니: {bride.mother}</div>
            </div>
          </div>
        }
      />

      {/* Account - Transfer */}
      <FloatingObject
        position={[0, -2, 1]}
        color="#ffff00"
        glowColor="#ffff00"
        label="bank.transfer()"
        content={
          <div className="text-xs">
            <div className="mb-2 text-[#00d4ff]">// 신랑측</div>
            <div>{groom.account.bank}: {groom.account.number}</div>
            <div className="mt-2 mb-2 text-[#ff0080]">// 신부측</div>
            <div>{bride.account.bank}: {bride.account.number}</div>
          </div>
        }
      />

      {/* Floor Grid */}
      <gridHelper args={[20, 20, '#00ff41', '#00ff4120']} position={[0, -3, 0]} />
    </group>
  );
}
