import React from 'react';

export default async function LanguageLayout({ children, params }: any) {
  const resolvedParams = await params;
  const language = resolvedParams?.language ?? 'unknown';
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="p-4 border-b">
        <div className="max-w-3xl mx-auto">Learning Korean - Language: {language}</div>
      </header>
      <div className="max-w-3xl mx-auto p-4">{children}</div>
    </div>
  );
}
