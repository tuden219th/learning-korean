"use client";
import React from "react";
import Link from "next/link";
import MobileNav from "./MobileNav";

export default function Header({ courses, language }: any) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="bg-transparent backdrop-blur-sm py-4">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="https://tudencafe.com" target="_blank" rel="noreferrer" className="text-sm text-zinc-700 hover:underline">
            ← Từ Đến Café
          </Link>
          <Link href="/en" className="text-sm text-zinc-600 hidden sm:inline">
            Học tiếng Anh
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-zinc-600 text-center">
            <div className="font-semibold">오늘도 한 걸음.</div>
            <div className="text-xs text-zinc-500">Mỗi ngày một bước nhỏ.</div>
          </div>

          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="p-2 rounded bg-white shadow-sm"
          >
            Menu
          </button>
        </div>
      </div>

      {open && <MobileNav courses={courses} onClose={() => setOpen(false)} language={language} />}
    </header>
  );
}
