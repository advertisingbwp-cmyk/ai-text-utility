"use client";
import React, { useEffect, useRef } from "react";

/** Native modal semantics: background inertness, Tab containment and Escape. */
export function Modal({label, onClose, children, className = ""}: {
  label: string; onClose: () => void; children: React.ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    dialog.querySelector<HTMLElement>("input:not(:disabled), button:not(:disabled)")?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return <dialog ref={ref} aria-label={label} aria-modal="true"
    className={`app-modal ${className}`}
    onCancel={e => { e.preventDefault(); onClose(); }}
    onKeyDown={e => {
      e.stopPropagation();
      if ((e.ctrlKey || e.metaKey) && ((label === "Search tools" && e.key.toLowerCase() === "k") || (label === "Keyboard Shortcuts" && e.key === "/"))) {
        e.preventDefault(); onClose(); return;
      }
      if (e.key === "Tab") {
        const items = Array.from(ref.current!.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    {children}
  </dialog>;
}
