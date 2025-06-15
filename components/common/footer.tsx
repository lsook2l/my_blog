/**
 * 블로그 푸터 컴포넌트
 * 사이트 정보 및 부가 링크 제공
 * 반응형 디자인으로 모든 화면 크기에서 최적화
 */

import Link from 'next/link';

// 푸터 네비게이션 링크 타입 정의
interface FooterLink {
  name: string;
  href: string;
  description: string;
}

// 푸터 네비게이션 링크들
const footerLinks: FooterLink[] = [
  { name: '소개', href: '/about', description: '블로그 소개 보기' },
  { name: '개인정보처리방침', href: '/privacy', description: '개인정보 보호정책' },
  { name: '이용약관', href: '/terms', description: '서비스 이용약관' },
  { name: '연락처', href: '/contact', description: '문의하기' },
];

export default function Footer() {
  // 현재 연도 자동 계산
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t sook-gradient-bg bg-white/80">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        
        {/* 메인 푸터 콘텐츠 - 반응형 2열/1열 레이아웃 */}
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          
          {/* 좌측: 브랜드 정보 및 저작권 */}
          <div className="flex flex-col items-center space-y-3 md:items-start">
            {/* 브랜드 로고 및 이름 */}
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-300 to-pink-200 flex items-center justify-center shadow-md">
                <span className="text-purple-800 font-bold text-sm" aria-hidden="true">💡</span>
              </div>
              <span className="font-extrabold text-lg text-purple-700">Sook's 자기계발 블로그</span>
            </div>
            
            {/* 저작권 정보 */}
            <div className="text-center md:text-left">
              <p className="text-sm text-purple-600 font-semibold">
                © {currentYear} <span className="font-bold">Sook's 자기계발 블로그</span>. All rights reserved.
              </p>
              <p className="text-xs text-purple-400 mt-1">
                심리학, 뇌과학, 인간관계, 독서를 통한 자기계발 여정 블로그
              </p>
            </div>
          </div>

          {/* 우측: 네비게이션 링크 */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <nav className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-purple-600 hover:text-purple-900 font-semibold transition-colors focus:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 rounded-full"
                  title={link.description}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            {/* 추가 정보 */}
            <div className="flex items-center space-x-4 text-xs text-purple-400">
              <Link 
                href="/rss.xml" 
                className="hover:text-purple-700 transition-colors"
                title="RSS 피드"
              >
                RSS
              </Link>
              <span>•</span>
              <Link 
                href="https://github.com" 
                className="hover:text-purple-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub에서 소스코드 보기"
              >
                GitHub
              </Link>
              <span>•</span>
              <span>한국어</span>
            </div>
          </div>
        </div>

        {/* 모바일에서 구분선과 간단 링크 추가 */}
        <div className="mt-6 pt-6 border-t border-purple-200 md:hidden">
          <div className="flex items-center justify-center space-x-4 text-xs text-purple-400">
            <Link href="/privacy" className="hover:text-purple-700 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-purple-700 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-purple-700 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 