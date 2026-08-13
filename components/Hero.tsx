import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero mb-8 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">안녕! 한국어를 배워볼까요?</h1>
          <p className="text-lg text-zinc-700 mb-4">Bắt đầu hành trình học tiếng Hàn theo từng bước — ấm áp, chậm rãi và có mục tiêu.</p>

          <div className="flex gap-3">
            <Link href="/ko" className="px-5 py-2 rounded-md bg-[var(--accent)] text-white font-semibold">Bắt đầu học</Link>
            <Link href="#courses" className="px-5 py-2 rounded-md border text-zinc-700">Xem lộ trình</Link>
          </div>
        </div>

        <div className="hero-decor relative h-40 md:h-44 flex items-center justify-center">
          <div className="path-card w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-extrabold text-[var(--accent)]">한</div>
              <div className="text-sm text-zinc-600 mt-2">Chữ Hàn — Bắt đầu từ đây</div>
            </div>
            <div className="hangul-deco">다</div>
          </div>
        </div>
      </div>
    </section>
  );
}
