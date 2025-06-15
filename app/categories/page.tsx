/**
 * 카테고리 목록 페이지 (실제 데이터베이스 연동)
 * 
 * 특징:
 * - 서버 컴포넌트로 구현
 * - 실제 Supabase 데이터베이스에서 카테고리 조회
 * - 각 카테고리의 게시물 개수 표시
 */

import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Metadata } from 'next';
import { Database } from '@/types/database.types';

// 타입 정의
type Category = Database['public']['Tables']['categories']['Row'];

// 페이지 메타데이터
export const metadata: Metadata = {
  title: '카테고리 | My Blog',
  description: '블로그의 모든 카테고리를 확인하고 관심 있는 주제의 글을 찾아보세요.',
  openGraph: {
    title: '카테고리 | My Blog',
    description: '블로그의 모든 카테고리를 확인하고 관심 있는 주제의 글을 찾아보세요.',
  },
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  try {
    console.log('=== 카테고리 목록 페이지: 데이터 조회 시작 ===');
    
    // 실제 Supabase 데이터베이스와 연동
    const supabase = await createServerSupabaseClient();

    // 카테고리 목록 조회
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (categoriesError) {
      console.error('카테고리 조회 오류:', categoriesError);
      throw categoriesError;
    }

    console.log(`✅ 카테고리 ${categories?.length || 0}개 조회 성공`);

    // 각 카테고리별 게시물 수 조회
    const categoriesWithCount = await Promise.all(
      (categories || []).map(async (category) => {
        const { count } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')
          .eq('category_id', category.id);

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description || `${category.name} 관련 글들을 모아놓은 카테고리입니다.`,
          postCount: count || 0,
          color: category.color || '#3b82f6' // 데이터베이스의 color 컬럼 사용
        };
      })
    );

    console.log('✅ 카테고리별 게시물 수 조회 완료');

    return (
      <div>
        {/* 페이지 헤더 */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
            카테고리
          </h1>
          <p className="text-lg text-purple-500 max-w-2xl mx-auto">
            관심 있는 주제별로 글을 찾아보세요. 각 카테고리마다 엄선된 고품질 콘텐츠를 제공합니다.
          </p>
        </section>

        {/* 카테고리 통계 */}
        <section className="mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-muted text-muted-foreground text-sm">
              <span>📚</span>
              <span>총 {categoriesWithCount.length}개의 카테고리</span>
              <span>•</span>
              <span>{categoriesWithCount.reduce((sum, cat) => sum + cat.postCount, 0)}개의 글</span>
            </div>
          </div>
        </section>

        {/* 카테고리 그리드 */}
        <section>
          {categoriesWithCount.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categoriesWithCount.map((category) => (
                <div key={category.id} className="flex flex-col">
                  <div
                    className="rounded-2xl flex-1 flex flex-col items-center justify-between px-6 py-8 mb-2"
                    style={{
                      background: `linear-gradient(135deg, ${category.color}22 0%, #fff 100%)`,
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                      style={{
                        background: `${category.color}33`,
                      }}
                    >
                      <span className="text-2xl font-bold" style={{ color: category.color }}>{category.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <h3 className="font-bold text-base text-gray-800 mb-1">{category.name}</h3>
                      {category.description && (
                        <p className="text-xs text-gray-500 text-center mb-2 line-clamp-2">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end pr-2">
                    <a href={`/categories/${category.slug}`} className="text-xs font-semibold text-purple-400 hover:text-purple-700 transition-colors">자세히 보기 &rarr;</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 카테고리가 없는 경우 */
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-2xl font-bold mb-4">카테고리가 없습니다</h3>
              <p className="text-muted-foreground mb-8">
                아직 등록된 카테고리가 없습니다. 곧 다양한 주제의 글들이 업데이트될 예정입니다.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                홈으로 돌아가기
              </Link>
            </div>
          )}
        </section>

        {/* 추가 안내 */}
        {categoriesWithCount.length > 0 && (
          <section className="mt-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">원하는 카테고리를 찾지 못하셨나요?</h3>
              <p className="text-muted-foreground mb-6">
                더 많은 주제와 카테고리가 지속적으로 추가되고 있습니다. 
                특정 주제에 대한 글을 원하신다면 언제든 요청해주세요.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/posts"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  모든 글 보기
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error('카테고리 데이터 조회 중 오류 발생:', error);
    
    // 에러 발생 시 빈 상태 표시
    return (
      <div>
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
            카테고리
          </h1>
          <p className="text-lg text-purple-500 max-w-2xl mx-auto">
            관심 있는 주제별로 글을 찾아보세요. 각 카테고리마다 엄선된 고품질 콘텐츠를 제공합니다.
          </p>
        </section>

        <section>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold mb-4">카테고리를 불러올 수 없습니다</h3>
            <p className="text-muted-foreground mb-6">
              일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </section>
      </div>
    );
  }
} 