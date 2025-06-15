/**
 * 블로그 포스트 상세 페이지 (2025년 새로운 Third-Party Auth 방식)
 * 동적 라우팅을 통해 개별 포스트의 상세 내용을 표시
 * 실제 Supabase 데이터베이스와 연동
 */

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generatePostMetadata } from '@/lib/metadata';
import MarkdownContent from '@/components/blog/markdown-content';
import RelatedPosts from '@/components/blog/related-posts';
import LikeButton from '@/components/blog/like-button';
import PostAdminActions from '@/components/blog/post-admin-actions';
import CommentSection from '@/components/blog/comment-section';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { Database } from '@/types/database.types';
import { getRelativeTime } from '@/lib/utils';

export const dynamic = "force-dynamic";

// 타입 정의
type Post = Database['public']['Tables']['posts']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

type PostWithCategory = Post & {
  categories?: Category | null;
};

// 페이지 props 타입 정의
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// 정적 경로 생성 함수
export async function generateStaticParams() {
  try {
    console.log('=== 정적 경로 생성 시작 ===');
    
    // 빌드 타임에는 인증 없이 공개 데이터만 조회
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug')
      .eq('status', 'published');

    if (error) {
      console.error('정적 경로 생성 오류:', error);
      return [];
    }

    console.log(`✅ 정적 경로 ${posts?.length || 0}개 생성`);
    return (posts || []).map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('정적 경로 생성 중 오류 발생:', error);
    return [];
  }
}

// 동적 메타데이터 생성 함수
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  // URL 디코딩 처리
  const slug = decodeURIComponent(rawSlug);
  
  try {
    console.log('=== 메타데이터 생성 시작 ===', slug);
    
    // 빌드 타임에는 인증 없이 공개 데이터만 조회
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        excerpt,
        slug,
        cover_image_url,
        created_at,
        updated_at,
        author_id,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
  
    if (error || !post) {
      console.log('❌ 메타데이터 생성 실패: 게시물 없음');
      return {
        title: '포스트를 찾을 수 없습니다 | My Blog',
        description: '요청하신 포스트를 찾을 수 없습니다.',
      };
    }

    // 카테고리 정보 추출
    const categoryData = Array.isArray(post.categories) && post.categories.length > 0 
      ? post.categories[0] 
      : null;

    // 새로운 메타데이터 유틸리티 함수 사용
    const metadata = generatePostMetadata({
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt || undefined,
      slug: post.slug,
      coverImageUrl: post.cover_image_url,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      categoryName: categoryData?.name,
      authorName: '작성자', // 추후 Clerk에서 실제 작성자 정보 가져올 예정
    });

    console.log('✅ 고급 메타데이터 생성 완료:', post.title);
    return metadata;

  } catch (error) {
    console.error('메타데이터 생성 중 오류 발생:', error);
    return {
      title: '포스트를 찾을 수 없습니다 | My Blog',
      description: '포스트를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

// 포스트 헤더 컴포넌트
function PostHeader({ post, isAuthor, likeCount }: { post: PostWithCategory; isAuthor: boolean; likeCount: number }) {
  return (
    <header className="mb-8">
      {/* 제목 */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-purple-500 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
        {post.title}
      </h1>
      {/* 카테고리 */}
      {post.categories && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Link
            href={`/categories/${post.categories.slug}`}
            className="inline-flex items-center"
          >
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-purple-100/60 text-purple-600 hover:bg-pink-100/80 transition-colors shadow">
              📁 {post.categories.name}
            </span>
          </Link>
        </div>
      )}
      {/* 메타 정보 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 text-purple-400 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <time>{getRelativeTime(post.created_at)}</time>
        </div>
        {post.updated_at !== post.created_at && (
          <>
            <div className="hidden sm:block w-px h-4 bg-purple-100" />
            <div className="flex items-center gap-2">
              <span>✏️</span>
              <time>수정됨: {getRelativeTime(post.updated_at)}</time>
            </div>
          </>
        )}
        <div className="hidden sm:block w-px h-8 bg-purple-100" />
        <div className="flex items-center">
          <LikeButton
            postId={post.id}
            initialLikes={likeCount}
            size="lg"
            showCount={true}
          />
        </div>
      </div>
      {/* 관리자 액션 버튼 */}
      {isAuthor && (
        <div className="mb-6">
          <PostAdminActions postId={post.id} postSlug={post.slug} />
        </div>
      )}
    </header>
  );
}

// 포스트 콘텐츠 컴포넌트
function PostContent({ post, likeCount }: { post: PostWithCategory; likeCount: number }) {
  return (
    <article className="mb-16">
      {/* 마크다운 콘텐츠 */}
      <MarkdownContent 
        content={post.content || ''}
        size="lg"
        enableTableOfContents={true}
        className="mb-12 prose prose-lg max-w-none prose-headings:text-purple-700 prose-a:text-pink-500 prose-blockquote:bg-purple-50 prose-blockquote:border-l-4 prose-blockquote:border-purple-300 prose-blockquote:text-purple-500 prose-code:bg-pink-50 prose-code:text-pink-600 prose-hr:border-purple-100 prose-table:border prose-table:border-purple-100"
      />
      {/* 소셜 공유 및 좋아요 버튼 */}
      <div className="mt-12 pt-8 border-t border-purple-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-purple-500">이 글이 도움이 되셨나요?</span>
            <LikeButton
              postId={post.id}
              initialLikes={likeCount}
              size="lg"
              showCount={true}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

// 메인 페이지 컴포넌트
export default async function PostDetailPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const supabase = await createServerSupabaseClient();
  const { userId } = await auth();

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories (
        id,
        name,
        slug,
        color
      )
    `)
    .eq('slug', slug)
    .single();

  if (error || !post) {
    console.error('게시물 조회 실패:', error);
    notFound();
  }

  // 작성자 여부 확인
  const isAuthor = userId === post.author_id;

  // 좋아요 개수 조회
  const { data: likeData } = await supabase
    .from('likes')
    .select('count', { count: 'exact' })
    .eq('post_id', post.id);

  const likeCount = likeData ? likeData[0]?.count || 0 : 0;

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 포스트 헤더 */}
      <PostHeader post={post as PostWithCategory} isAuthor={isAuthor} likeCount={likeCount} />

      {/* 커버 이미지 (추가) */}
      {post.cover_image_url && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md mb-8">
          <Image
            src={post.cover_image_url}
            alt={post.title || '게시물 커버 이미지'}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
          />
        </div>
      )}

      {/* 포스트 내용 */}
      <PostContent post={post as PostWithCategory} likeCount={likeCount} />
    </article>
  );
} 