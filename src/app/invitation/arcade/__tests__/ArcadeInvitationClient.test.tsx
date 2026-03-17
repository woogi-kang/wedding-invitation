import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ArcadeInvitationClient } from '../ArcadeInvitationClient';

const mockUseSearchParams = vi.fn();
const mockRequestAnimationFrame = vi.fn<(callback: FrameRequestCallback) => number>();
const titleScreenStates: boolean[] = [];
const stageEventStates: number[] = [];
const storage = new Map<string, string>();

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  MotionConfig: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@/components/trick/arcade/TitleScreen', () => ({
  TitleScreen: ({ hasSaveData }: { hasSaveData?: boolean }) => {
    titleScreenStates.push(Boolean(hasSaveData));
    return <div>{hasSaveData ? 'HAS_SAVE' : 'NO_SAVE'}</div>;
  },
}));

vi.mock('@/components/trick/arcade/CharacterSelect', () => ({
  CharacterSelect: () => <div>CHARACTER_SELECT</div>,
}));

vi.mock('@/components/trick/arcade/WorldMap', () => ({
  WorldMap: () => <div>WORLD_MAP</div>,
}));

vi.mock('@/components/trick/arcade/StageEvent', () => ({
  StageEvent: ({ stageIndex }: { stageIndex: number }) => {
    stageEventStates.push(stageIndex);
    return <div>{`STAGE_${stageIndex}`}</div>;
  },
}));

vi.mock('@/components/trick/arcade/EndingSequence', () => ({
  EndingSequence: () => <div>ENDING</div>,
}));

vi.mock('@/components/trick/arcade/PostGameVillage', () => ({
  PostGameVillage: () => <div>POST_GAME</div>,
}));

vi.mock('@/components/trick/arcade/shared', () => ({
  BattleTransition: () => null,
}));

describe('ArcadeInvitationClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.clear();
    titleScreenStates.length = 0;
    stageEventStates.length = 0;
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockRequestAnimationFrame.mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('requestAnimationFrame', mockRequestAnimationFrame);
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => {
        storage.clear();
      },
    });
  });

  it('hydrates saved progress and exposes continue state on the title screen', async () => {
    localStorage.setItem(
      'wedding_arcade_progress',
      JSON.stringify({
        completedStages: [0, 1],
        currentStage: 2,
        phase: 'world-map',
      }),
    );

    render(<ArcadeInvitationClient galleryImages={[]} />);

    await waitFor(() => {
      expect(screen.getByText('HAS_SAVE')).toBeDefined();
    });

    expect(titleScreenStates).toContain(true);
  });

  it('opens a requested stage directly from the query string', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('stage=5'));

    render(<ArcadeInvitationClient galleryImages={[]} />);

    expect(screen.getByText('STAGE_4')).toBeDefined();
    expect(stageEventStates.at(-1)).toBe(4);
  });
});
