import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const noto = Noto_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
});

const notoKR = Noto_Sans_KR({
  variable: "--font-kr",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Từ Đến — Học tiếng Hàn cho Ngọc Diệp",
    template: "%s — Từ Đến"
  },
  description: "Tài nguyên học tiếng Hàn dành cho Ngọc Diệp — lộ trình ấm áp, bài học ngắn và hoạt động tương tác.",
  applicationName: "Từ Đến",
  metadataBase: new URL("https://korean.tudencafe.com"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: "https://korean.tudencafe.com",
  },
  openGraph: {
    title: "Từ Đến — Học tiếng Hàn cho Ngọc Diệp",
    description: "Tài nguyên học tiếng Hàn dành cho Ngọc Diệp — lộ trình ấm áp, bài học ngắn và hoạt động tương tác.",
    url: "https://korean.tudencafe.com",
    siteName: "Từ Đến",
    images: [
      {
        url: "https://korean.tudencafe.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Từ Đến — Học tiếng Hàn cho Ngọc Diệp"
      }
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Từ Đến — Học tiếng Hàn cho Ngọc Diệp",
    description: "Tài nguyên học tiếng Hàn dành cho Ngọc Diệp — lộ trình ấm áp, bài học ngắn và hoạt động tương tác.",
    images: ["https://korean.tudencafe.com/og-image.png"],
    creator: "@tudencafe",
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" }
    ],
    apple: [{ url: "/logo.svg" }]
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${noto.variable} ${notoKR.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
