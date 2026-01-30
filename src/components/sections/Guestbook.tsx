'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Trash2 } from 'lucide-react';
import { Section, SectionTitle } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';
import { isBeforeWedding } from '@/lib/utils';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { toast } from 'sonner';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  createdAt: Timestamp | null;
  password: string;
}

export function Guestbook() {
  const { guestbook } = WEDDING_INFO;
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    if (!guestbook.enabled) return;

    const q = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: GuestMessage[] = [];
      snapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
        } as GuestMessage);
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [guestbook.enabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim() || !password.trim()) {
      toast.error('이름, 메시지, 비밀번호를 모두 입력해주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        message: message.trim(),
        password: password.trim(),
        createdAt: serverTimestamp(),
      });

      setName('');
      setMessage('');
      setPassword('');
      toast.success('축하 메시지가 등록되었습니다');
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('메시지 등록에 실패했습니다. 다시 시도해주세요');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, storedPassword: string) => {
    const masterPassword = process.env.NEXT_PUBLIC_GUESTBOOK_MASTER_PASSWORD;
    if (deletePassword !== storedPassword && deletePassword !== masterPassword) {
      toast.error('비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      await deleteDoc(doc(db, 'guestbook', id));
      toast.success('메시지가 삭제되었습니다');
      setDeleteId(null);
      setDeletePassword('');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('삭제에 실패했습니다');
    }
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // 방명록 비활성화 또는 결혼식 당일 이후면 표시하지 않음
  if (!guestbook.enabled || !isBeforeWedding()) return null;

  return (
    <Section id="guestbook" background="secondary">
      <SectionTitle title="방명록" subtitle="축하 메시지" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-white shadow-sm"
      >
        {/* Header */}
        <div className="border-b border-[var(--color-border-light)] bg-gradient-to-r from-[var(--color-secondary)] to-white px-4 min-[375px]:px-6 py-3 min-[375px]:py-4">
          <div className="flex items-center gap-2.5 min-[375px]:gap-3">
            <div className="flex h-9 w-9 min-[375px]:h-10 min-[375px]:w-10 items-center justify-center rounded-full bg-[var(--color-botanical-light)]">
              <MessageSquare className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-sm min-[375px]:text-base font-medium text-[var(--color-text)]">축하 메시지</p>
              <p className="text-[10px] min-[375px]:text-xs text-[var(--color-text-muted)]">
                신랑 신부에게 축하의 말씀을 전해주세요
              </p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="border-b border-[var(--color-border-light)] p-4 min-[375px]:p-6">
          <div className="space-y-3">
            {/* Stack vertically on very small screens, side by side on larger */}
            <div className="flex flex-col min-[360px]:flex-row gap-2">
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 min-w-0 rounded-lg border border-[var(--color-border-light)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                maxLength={20}
              />
              <input
                type="password"
                placeholder="비밀번호 (삭제용)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 min-w-0 rounded-lg border border-[var(--color-border-light)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                maxLength={10}
              />
            </div>
            <div className="flex gap-2">
              <textarea
                placeholder="축하 메시지를 남겨주세요"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="flex-1 resize-none rounded-lg border border-[var(--color-border-light)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-auto w-12 min-[375px]:w-14 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
              >
                <Send className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5" />
              </button>
            </div>
          </div>
        </form>

        {/* Messages List */}
        <div className="max-h-[400px] overflow-y-auto p-4 min-[375px]:p-6">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-[var(--color-text-muted)]">
              첫 번째 축하 메시지를 남겨주세요!
            </p>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-lg bg-[var(--color-secondary)] p-3 min-[375px]:p-4"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-botanical-light)]">
                          <User className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--color-text)]">
                          {msg.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          {formatDate(msg.createdAt)}
                        </span>
                        <button
                          onClick={() => setDeleteId(msg.id)}
                          className="text-[var(--color-text-muted)] transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-text-light)] whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    {/* Delete Confirmation */}
                    {deleteId === msg.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 flex items-center gap-2 border-t border-[var(--color-border-light)] pt-3"
                      >
                        <input
                          type="password"
                          placeholder="비밀번호 확인"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="flex-1 rounded border border-[var(--color-border-light)] px-2 py-1.5 text-xs focus:border-[var(--color-primary)] focus:outline-none"
                        />
                        <button
                          onClick={() => handleDelete(msg.id, msg.password)}
                          className="flex-1 rounded bg-red-500 px-2 py-1.5 text-xs text-white hover:bg-red-600"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(null);
                            setDeletePassword('');
                          }}
                          className="flex-1 rounded bg-gray-300 px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-400"
                        >
                          취소
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </Section>
  );
}
