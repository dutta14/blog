import { useEffect, useRef, useCallback, useState } from 'react';
import '../styles/BookingModal.css';

export type BookingContext = 'conversation' | 'speaking';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  context?: BookingContext;
}

const COPY = {
  conversation: {
    label: 'Conversation',
    title: 'Let\u2019s find a time',
    desc: 'You\u2019ll be taken to Google Calendar to pick a 30-minute slot.',
  },
  speaking: {
    label: 'Speaking Engagement',
    title: 'Book a speaking session',
    desc: 'You\u2019ll be taken to Google Calendar to schedule a conversation about your event.',
  },
} as const;

const CALENDAR_URL = 'https://calendar.app.google/UeHBbGhSZYHaBGMC9';
const CLOSE_ANIMATION_MS = 150;

export default function BookingModal({
  open,
  onClose,
  context = 'conversation',
}: BookingModalProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setVisible(false);
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [onClose]);

  // Open: lock body scroll, store previous focus, show modal
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setVisible(true);
      setClosing(false);
      document.body.style.overflow = 'hidden';
    }
  }, [open]);

  // Focus the modal when it becomes visible
  useEffect(() => {
    if (visible && !closing && modalRef.current) {
      modalRef.current.focus();
    }
  }, [visible, closing]);

  // Restore focus and body scroll on unmount / close
  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
  }, [visible]);

  // Escape key
  useEffect(() => {
    if (!visible || closing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, closing, handleClose]);

  // Focus trap
  useEffect(() => {
    if (!visible || closing) return;
    const modal = modalRef.current;
    if (!modal) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [visible, closing]);

  if (!visible) return null;

  const copy = COPY[context];

  return (
    <div
      className={`booking-overlay${closing ? ' booking-overlay--closing' : ''}`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        aria-describedby="booking-desc"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="booking-close"
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        <div className="booking-body">
          <span className="booking-label" aria-hidden="true">
            {copy.label}
          </span>
          <h2 className="booking-title" id="booking-title">
            {copy.title}
          </h2>
          <p className="booking-desc" id="booking-desc">
            {copy.desc}
          </p>
          <hr className="booking-divider" aria-hidden="true" />
          <a
            className="booking-cta"
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
          >
            Open Google Calendar
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 3h7v7" />
              <path d="M13 3L3 13" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
