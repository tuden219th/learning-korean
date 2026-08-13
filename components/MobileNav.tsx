"use client";
import React from "react";
import Link from "next/link";

export default function MobileNav({ courses, onClose, language }: any) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 w-80 h-full bg-white dark:bg-zinc-900 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Menu</h3>
          <button aria-label="Close menu" onClick={onClose} className="px-2 py-1">Close</button>
        </div>

        <nav className="space-y-4">
          {courses.map((c: any) => (
            <div key={c.id}>
              <div className="text-sm font-medium">{c.title}</div>
              <div className="mt-2 space-y-1 text-sm">
                {c.modules.map((m: any) => (
                  <div key={m.id}>
                    <div className="text-xs font-semibold text-zinc-600">{m.title}</div>
                    <div className="mt-1 flex flex-col gap-1">
                      {m.lessons.map((l: any) => (
                        <Link key={l.id} href={`/${language}/${m.slug}/${l.slug}`} className="text-indigo-600">
                          {l.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}
