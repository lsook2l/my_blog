/**
 * 블로그 홈페이지 컴포넌트 (2025년 새로운 Third-Party Auth 방식)
 * Hero 섹션, 최신 포스트, 카테고리 섹션으로 구성
 * 실제 Supabase 데이터베이스와 연동
 */

import { Suspense } from 'react';
import { PostCard } from '@/components/blog/post-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Database } from '@/types/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, Eye, ArrowRight } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export const dynamic = "force-dynamic";

// 타입 정의
type Post = Database['public']['Tables']['posts']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

type PostWithCategory = Post & {
  categories?: Category | null;
};

// 날짜 포맷팅 함수
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 최신 게시물 조회
async function getLatestPosts(): Promise<PostWithCategory[]> {
  try {
    console.log('=== 홈페이지: 최신 게시물 조회 ===');
    const supabase = await createServerSupabaseClient();

    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        view_count,
        created_at,
        content,
        status,
        author_id,
        category_id,
        updated_at,
        categories (
          id,
          name,
          slug,
          color,
          description,
          created_at,
          updated_at
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('최신 게시물 조회 오류:', error);
      return [];
    }

    console.log(`✅ 최신 게시물 ${posts?.length || 0}개 조회 성공`);
    return (posts || []).map(post => ({
      ...post,
      categories: Array.isArray(post.categories)
        ? (post.categories[0] || null)
        : post.categories ?? null,
    }));
  } catch (error) {
    console.error('최신 게시물 조회 중 오류:', error);
    return [];
  }
}

// 카테고리 목록 조회
async function getCategories(): Promise<Category[]> {
  try {
    console.log('=== 홈페이지: 카테고리 목록 조회 ===');
    const supabase = await createServerSupabaseClient();

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
      .limit(6); // 홈페이지에는 최대 6개만 표시

    if (error) {
      console.error('카테고리 조회 오류:', error);
      return [];
    }

    console.log(`✅ 카테고리 ${categories?.length || 0}개 조회 성공`);
    return categories || [];
  } catch (error) {
    console.error('카테고리 조회 중 오류:', error);
    return [];
  }
}

export default async function Home() {
  // 서버 컴포넌트에서 데이터 조회
  const [latestPosts, categories] = await Promise.all([
    getLatestPosts(),
    getCategories()
  ]);

  return (
    <div id="main-content">
      {/* Hero 섹션 */}
      <section className="text-center mb-20">
        <div className="max-w-4xl md:max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-purple-100 text-purple-600 font-semibold text-xs tracking-wide shadow-sm"># 자기계발의 새로운 여정을 함께 시작해요</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">Sook's 자기계발 블로그</h1>
          <p className="text-base md:text-lg text-purple-500 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">심리학, 뇌과학, 인간관계, 그리고 독서를 통한 자기계발의 여정을 함께 나눕니다</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/posts" className="sook-btn">포스트 보기</Link>
          </div>
        </div>
      </section>

      {/* 최신 게시물 섹션 */}
      <section className="mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800">최신 포스트</h2>
            <Link href="/posts" className="text-sm font-semibold text-purple-500 hover:text-purple-700 transition-colors">더 보기</Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Card key={post.id} className="sook-card group">
                  <CardHeader className="p-0">
                    {post.cover_image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-2xl">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {/* 카테고리 */}
                      {post.categories && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ backgroundColor: `${post.categories.color}20`, color: post.categories.color }}
                        >
                          {post.categories.name}
                        </Badge>
                      )}

                      {/* 제목 */}
                      <h3 className="text-lg font-bold line-clamp-2 group-hover:text-purple-600 transition-colors">
                        <Link href={`/posts/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      {/* 요약 */}
                      {post.excerpt && (
                        <p className="text-purple-500 text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      {/* 메타 정보 */}
                      <div className="flex items-center gap-4 text-xs text-purple-400">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* 빈 상태 */
            <Card className="sook-card text-center py-12">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2 text-purple-700">아직 게시물이 없습니다</h3>
                  <p className="text-purple-400 mb-6">첫 번째 블로그 글을 작성해보세요!</p>
                  
                  <SignedIn>
                    <Button asChild className="sook-btn">
                      <Link href="/admin/posts/create">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        첫 글 작성하기
                      </Link>
                    </Button>
                  </SignedIn>
                  
                  <SignedOut>
                    <p className="text-sm text-purple-400">
                      게시물을 작성하려면 로그인이 필요합니다.
                    </p>
                  </SignedOut>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800">카테고리</h2>
          </div>
          {categories.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
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
            <div className="text-center py-8">
              <p className="text-purple-400">아직 카테고리가 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
