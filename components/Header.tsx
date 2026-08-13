"use client";
import React from "react";
import Link from "next/link";
import MobileNav from "./MobileNav";

export default function Header({ courses, language }: any) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="bg-white dark:bg-zinc-900 border-b p-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/${language ?? "ko"}`} className="font-semibold text-lg">
            Learning Korean
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/${language ?? "ko"}`} className="text-sm text-zinc-600 hidden sm:inline">
            {language ?? 'ko'}
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="p-2 rounded bg-zinc-100 dark:bg-zinc-800"
          >
            Menu
          </button>
        </div>
      </div>

      {open && <MobileNav courses={courses} onClose={() => setOpen(false)} language={language} />}
    </header>
  );
}
