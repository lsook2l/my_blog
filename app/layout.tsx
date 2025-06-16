import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Providers } from "./providers";

// 폰트 설정 - Inter와 Noto Sans KR 조합
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// SEO 메타데이터 설정
export const metadata: Metadata = {
  title: {
    default: "Sook's Blog - 자기계발 성장 블로그",
    template: "%s | Sook's Blog",
  },
  description: "자기계발, 심리학&뇌과학, 생산성 향상, 습관 형성에 관한 개인 블로그입니다. 제가 경험한 다양한 자기계발 방법과 도구들을 공유하며, 독자들과 함께 성장하는 것을 목표로 합니다.",
  keywords: ["자기계발", "심리학", "뇌과학", "생산성", "습관", "성장", "독서", "시간 관리", "마음챙김", "라이프스타일", "디지털 웰빙"],
  authors: [{ name: "Sook's Blog Team" }],
  creator: "Sook's Blog",
  publisher: "Sook's Blog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  
  // Open Graph 설정
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    title: "Sook's Blog - 자기계발 성장 블로그",
    description: "자기계발, 심리학&뇌과학, 생산성 향상, 습관 형성에 관한 개인 블로그입니다.",
    siteName: "Sook's Blog",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sook's Blog",
      },
    ],
  },
  
  // Twitter Card 설정
  twitter: {
    card: "summary_large_image",
    title: "Sook's Blog - 자기계발 성장 블로그",
    description: "자기계발, 심리학&뇌과학, 생산성 향상, 습관 형성에 관한 개인 블로그입니다.",
    images: ["/images/og-image.jpg"],
    creator: "@sook's blog",
  },
  
  // 기타 메타데이터
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Favicon 설정
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  
  // Manifest 설정
  manifest: "/site.webmanifest",
};

// 뷰포트 설정
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

/**
 * 루트 레이아웃 컴포넌트
 * 전역 레이아웃 및 설정 제공
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKR.variable}`}>
      <head>
        {/* 구조화된 데이터 - 웹사이트 정보 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Sook's Blog",
              "description": "자기계발, 심리학&뇌과학, 생산성 향상, 습관 형성에 관한 개인 블로그",
              "url": process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
              "author": {
                "@type": "Organization",
                "name": "Sook's Blog Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Sook's Blog",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/images/logo.png`
                }
              },
              "inLanguage": "ko-KR"
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {/* 전체 레이아웃 구조 */}
          <div className="relative flex min-h-screen flex-col">
            {/* 헤더 */}
            <Header />
            
            {/* 메인 콘텐츠 영역 */}
            <main className="flex-1">
              <div className="max-w-4xl md:max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            
            {/* 푸터 */}
            <Footer />
          </div>
          
          {/* 접근성을 위한 스킵 링크 */}
          <div className="sr-only">
            <a 
              href="#main-content" 
              className="absolute left-0 top-0 z-50 -translate-y-full transform bg-primary px-4 py-2 text-primary-foreground transition-transform focus:translate-y-0"
            >
              메인 콘텐츠로 건너뛰기
            </a>
          </div>
        </Providers>
      </body>
    </html>
  );
}
