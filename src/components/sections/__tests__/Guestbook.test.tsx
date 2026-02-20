import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Guestbook } from '../Guestbook';

// Mock firebase/firestore
const mockAddDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockOnSnapshot = vi.fn();
const mockCollection = vi.fn();
const mockQuery = vi.fn();
const mockOrderBy = vi.fn();
const mockDoc = vi.fn();
const mockServerTimestamp = vi.fn(() => ({ _type: 'serverTimestamp' }));

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  orderBy: (...args: unknown[]) => mockOrderBy(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  serverTimestamp: () => mockServerTimestamp(),
  Timestamp: class MockTimestamp {
    seconds: number;
    nanoseconds: number;
    constructor(s: number, n: number) {
      this.seconds = s;
      this.nanoseconds = n;
    }
    toDate() {
      return new Date(this.seconds * 1000);
    }
  },
}));

// Mock firebase app
vi.mock('@/lib/firebase', () => ({
  db: {},
}));

// Mock sonner toast
const mockToastError = vi.fn();
const mockToastSuccess = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
    success: (...args: unknown[]) => mockToastSuccess(...args),
  },
}));

// Mock constants - mutable object for per-test override
const mockGuestbook = { enabled: true };
vi.mock('@/lib/constants', () => ({
  WEDDING_INFO: {
    get guestbook() {
      return mockGuestbook;
    },
  },
}));

// Mock utils - vi.fn for per-test override
const mockIsBeforeWedding = vi.fn(() => true);
vi.mock('@/lib/utils', () => ({
  isBeforeWedding: (...args: unknown[]) => mockIsBeforeWedding(...args),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => {
      const { initial, animate, exit, whileInView, viewport, ...validProps } = props;
      void initial; void animate; void exit; void whileInView; void viewport;
      return <div {...validProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Section components
vi.mock('@/components/common/Section', () => ({
  Section: ({ children, ...props }: Record<string, unknown>) => (
    <section {...props}>{children}</section>
  ),
  SectionTitle: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  ),
}));

function createMockSnapshot(docs: Array<{ id: string; data: Record<string, unknown> }>) {
  return {
    size: docs.length,
    forEach: (cb: (doc: { id: string; data: () => Record<string, unknown> }) => void) => {
      docs.forEach((d) => cb({ id: d.id, data: () => d.data }));
    },
  };
}

describe('Guestbook', () => {
  let snapshotCallback: ((snapshot: ReturnType<typeof createMockSnapshot>) => void) | null = null;
  let snapshotErrorCallback: ((error: Error) => void) | null = null;
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    snapshotCallback = null;
    snapshotErrorCallback = null;
    mockGuestbook.enabled = true;
    mockIsBeforeWedding.mockReturnValue(true);

    mockOnSnapshot.mockImplementation((_q: unknown, onNext: typeof snapshotCallback, onError?: typeof snapshotErrorCallback) => {
      snapshotCallback = onNext;
      snapshotErrorCallback = onError ?? null;
      onNext!(createMockSnapshot([]));
      return mockUnsubscribe;
    });

    mockAddDoc.mockResolvedValue({ id: 'new-doc-id' });
    mockDeleteDoc.mockResolvedValue(undefined);
  });

  describe('렌더링', () => {
    it('방명록 폼이 정상 렌더링된다', () => {
      render(<Guestbook />);

      expect(screen.getByPlaceholderText('이름')).toBeDefined();
      expect(screen.getByPlaceholderText('비밀번호 (삭제용)')).toBeDefined();
      expect(screen.getByPlaceholderText('축하 메시지를 남겨주세요')).toBeDefined();
      expect(screen.getByText('첫 번째 축하 메시지를 남겨주세요!')).toBeDefined();
    });

    it('메시지가 있으면 목록에 표시된다', () => {
      render(<Guestbook />);

      act(() => {
        snapshotCallback!(createMockSnapshot([
          {
            id: 'msg-1',
            data: {
              name: '홍길동',
              message: '결혼 축하합니다!',
              password: '1234',
              createdAt: null,
            },
          },
          {
            id: 'msg-2',
            data: {
              name: '김철수',
              message: '행복하세요!',
              password: '5678',
              createdAt: null,
            },
          },
        ]));
      });

      expect(screen.getByText('홍길동')).toBeDefined();
      expect(screen.getByText('결혼 축하합니다!')).toBeDefined();
      expect(screen.getByText('김철수')).toBeDefined();
      expect(screen.getByText('행복하세요!')).toBeDefined();
    });

    it('guestbook.enabled가 false이면 렌더링하지 않는다', () => {
      mockGuestbook.enabled = false;

      const { container } = render(<Guestbook />);
      expect(container.innerHTML).toBe('');
    });

    it('결혼식 이후면 렌더링하지 않는다', () => {
      mockIsBeforeWedding.mockReturnValue(false);

      const { container } = render(<Guestbook />);
      expect(container.innerHTML).toBe('');
    });
  });

  describe('메시지 작성', () => {
    it('모든 필드를 입력하면 메시지가 등록된다', async () => {
      render(<Guestbook />);

      fireEvent.change(screen.getByPlaceholderText('이름'), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByPlaceholderText('비밀번호 (삭제용)'), { target: { value: '1234' } });
      fireEvent.change(screen.getByPlaceholderText('축하 메시지를 남겨주세요'), { target: { value: '축하합니다!' } });

      fireEvent.submit(screen.getByPlaceholderText('축하 메시지를 남겨주세요').closest('form')!);

      await waitFor(() => {
        expect(mockAddDoc).toHaveBeenCalledWith(
          undefined,
          expect.objectContaining({
            name: '홍길동',
            message: '축하합니다!',
            password: '1234',
          })
        );
      });

      expect(mockToastSuccess).toHaveBeenCalledWith('축하 메시지가 등록되었습니다');
    });

    it('등록 성공 후 입력 필드가 초기화된다', async () => {
      render(<Guestbook />);

      const nameInput = screen.getByPlaceholderText('이름') as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText('비밀번호 (삭제용)') as HTMLInputElement;
      const messageInput = screen.getByPlaceholderText('축하 메시지를 남겨주세요') as HTMLTextAreaElement;

      fireEvent.change(nameInput, { target: { value: '홍길동' } });
      fireEvent.change(passwordInput, { target: { value: '1234' } });
      fireEvent.change(messageInput, { target: { value: '축하합니다!' } });

      fireEvent.submit(messageInput.closest('form')!);

      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(passwordInput.value).toBe('');
        expect(messageInput.value).toBe('');
      });
    });

    it('빈 필드가 있으면 에러 토스트가 표시된다', () => {
      render(<Guestbook />);

      fireEvent.change(screen.getByPlaceholderText('이름'), { target: { value: '홍길동' } });

      fireEvent.submit(screen.getByPlaceholderText('축하 메시지를 남겨주세요').closest('form')!);

      expect(mockToastError).toHaveBeenCalledWith('이름, 메시지, 비밀번호를 모두 입력해주세요');
      expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it('공백만 입력하면 에러 토스트가 표시된다', () => {
      render(<Guestbook />);

      fireEvent.change(screen.getByPlaceholderText('이름'), { target: { value: '   ' } });
      fireEvent.change(screen.getByPlaceholderText('비밀번호 (삭제용)'), { target: { value: '1234' } });
      fireEvent.change(screen.getByPlaceholderText('축하 메시지를 남겨주세요'), { target: { value: '축하!' } });

      fireEvent.submit(screen.getByPlaceholderText('축하 메시지를 남겨주세요').closest('form')!);

      expect(mockToastError).toHaveBeenCalledWith('이름, 메시지, 비밀번호를 모두 입력해주세요');
      expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it('addDoc 실패 시 에러 토스트가 표시된다', async () => {
      mockAddDoc.mockRejectedValueOnce(new Error('Firestore write failed'));

      render(<Guestbook />);

      fireEvent.change(screen.getByPlaceholderText('이름'), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByPlaceholderText('비밀번호 (삭제용)'), { target: { value: '1234' } });
      fireEvent.change(screen.getByPlaceholderText('축하 메시지를 남겨주세요'), { target: { value: '축하합니다!' } });

      fireEvent.submit(screen.getByPlaceholderText('축하 메시지를 남겨주세요').closest('form')!);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('메시지 등록에 실패했습니다. 다시 시도해주세요');
      });
    });
  });

  describe('메시지 삭제', () => {
    it('올바른 비밀번호로 삭제할 수 있다', async () => {
      render(<Guestbook />);

      act(() => {
        snapshotCallback!(createMockSnapshot([
          {
            id: 'msg-1',
            data: { name: '홍길동', message: '축하합니다!', password: '1234', createdAt: null },
          },
        ]));
      });

      // 삭제 버튼 클릭 (Trash2 아이콘 버튼)
      const deleteButtons = screen.getAllByRole('button');
      const trashButton = deleteButtons.find((btn) => btn.querySelector('.lucide-trash-2'));
      fireEvent.click(trashButton!);

      // 비밀번호 입력 및 삭제 확인
      fireEvent.change(screen.getByPlaceholderText('비밀번호 확인'), { target: { value: '1234' } });
      fireEvent.click(screen.getByText('삭제'));

      await waitFor(() => {
        expect(mockDeleteDoc).toHaveBeenCalled();
        expect(mockToastSuccess).toHaveBeenCalledWith('메시지가 삭제되었습니다');
      });
    });

    it('잘못된 비밀번호로 삭제 시 에러 토스트가 표시된다', () => {
      render(<Guestbook />);

      act(() => {
        snapshotCallback!(createMockSnapshot([
          {
            id: 'msg-1',
            data: { name: '홍길동', message: '축하합니다!', password: '1234', createdAt: null },
          },
        ]));
      });

      const deleteButtons = screen.getAllByRole('button');
      const trashButton = deleteButtons.find((btn) => btn.querySelector('.lucide-trash-2'));
      fireEvent.click(trashButton!);

      fireEvent.change(screen.getByPlaceholderText('비밀번호 확인'), { target: { value: 'wrong' } });
      fireEvent.click(screen.getByText('삭제'));

      expect(mockToastError).toHaveBeenCalledWith('비밀번호가 일치하지 않습니다');
      expect(mockDeleteDoc).not.toHaveBeenCalled();
    });

    it('취소 버튼을 누르면 삭제 UI가 사라진다', () => {
      render(<Guestbook />);

      act(() => {
        snapshotCallback!(createMockSnapshot([
          {
            id: 'msg-1',
            data: { name: '홍길동', message: '축하합니다!', password: '1234', createdAt: null },
          },
        ]));
      });

      const deleteButtons = screen.getAllByRole('button');
      const trashButton = deleteButtons.find((btn) => btn.querySelector('.lucide-trash-2'));
      fireEvent.click(trashButton!);

      expect(screen.getByPlaceholderText('비밀번호 확인')).toBeDefined();

      fireEvent.click(screen.getByText('취소'));

      expect(screen.queryByPlaceholderText('비밀번호 확인')).toBeNull();
    });
  });

  describe('실시간 구독', () => {
    it('onSnapshot이 호출되고 언마운트 시 구독 해제된다', () => {
      const { unmount } = render(<Guestbook />);

      expect(mockOnSnapshot).toHaveBeenCalled();

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('onSnapshot 에러 시 에러 토스트가 표시된다', () => {
      render(<Guestbook />);

      act(() => {
        snapshotErrorCallback!(new Error('Permission denied'));
      });

      expect(mockToastError).toHaveBeenCalledWith('방명록을 불러오는데 실패했습니다');
    });
  });
});
