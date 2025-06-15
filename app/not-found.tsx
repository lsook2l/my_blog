import Link from 'next/link'

export const dynamic = 'force-static'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
      <Link 
        href="/"
        className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
} 