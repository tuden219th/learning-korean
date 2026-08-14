"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function StudyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      <path d="M8 6h8" />
      <path d="M8 10h6" />
    </svg>
  );
}

function CourseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function WordIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16" />
      <path d="M8 3v2" />
      <path d="M16 3v2" />
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
      <path d="M8 18h3" />
    </svg>
  );
}

export default function BMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  const menuItems = [
    {
      korean: "홈",
      label: "Home",
      href: "/",
      icon: <HomeIcon />,
    },
    {
      korean: "학습",
      label: "Học tập",
      href: "/ko",
      icon: <StudyIcon />,
    },
    {
      korean: "코스",
      label: "Khóa học",
      href: "/ko",
      icon: <CourseIcon />,
    },
    {
      korean: "단어",
      label: "Từ vựng",
      href: "/ko",
      icon: <WordIcon />,
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* Nút menu */}
      <button
        type="button"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white/70 text-zinc-700 backdrop-blur-sm transition hover:bg-zinc-100"
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Menu panel */}
      {open && (
        <div className="absolute left-0 top-full z-[100] mt-3 w-72 rounded-2xl border border-zinc-200 bg-white/95 p-2 shadow-xl backdrop-blur-md">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.korean}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-zinc-800 transition hover:bg-zinc-100"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                  {item.icon}
                </span>

                <span className="min-w-0">
                  <span className="block text-base font-semibold leading-tight">
                    {item.korean}
                  </span>

                  <span className="block text-sm text-zinc-500">
                    {item.label}
                  </span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}