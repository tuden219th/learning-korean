"use client";
import React from "react";
import Link from "next/link";
import MobileNav from "./MobileNav";

export default function Navbar({}: any) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="https://tudencafe.com" target="_blank" rel="noreferrer" className="font-semibold text-lg">
              Từ Đến
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 text-sm text-zinc-700">
            <Link href="/" className="hover:underline">홈 / Home</Link>
            <Link href="/ko" className="hover:underline">학습 / Học tập</Link>
            <Link href="/ko" className="hover:underline">코스 / Khóa học</Link>
            <Link href="/ko" className="hover:underline">단어 / Từ vựng</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/ko" className="hidden sm:inline-block px-4 py-2 rounded-md bg-[var(--accent)] text-white font-medium">Bắt đầu học</Link>

            <button
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="md:hidden p-2 rounded bg-zinc-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
      </div>

      {open && <MobileNav courses={[]} onClose={() => setOpen(false)} language={"ko"} />}
    </div>
  );
}
