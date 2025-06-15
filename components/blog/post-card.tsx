'use client';

/**
 * 블로그 포스트 카드 컴포넌트
 * 포스트 목록에서 개별 포스트를 표시하는 재사용 가능한 컴포넌트
 */

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types';
import { useState } from 'react';
import LikeButton from './like-button';
import { CalendarDays, Eye } from 'lucide-react';

/**
 * PostCard 컴포넌트의 Props 인터페이스
 */
interface PostCardProps {
  /** 표시할 블로그 포스트 데이터 */
  post: BlogPost;
  /** 카드 크기 변형 */
  variant?: 'default' | 'featured' | 'compact';
  /** 카테고리 태그 표시 여부 */
  showCategory?: boolean;
  /** 작성자 정보 표시 여부 */
  showAuthor?: boolean;
  /** 통계 정보 표시 여부 (조회수, 좋아요) */
  showStats?: boolean;
  /** 좋아요 버튼 표시 여부 */
  showLikeButton?: boolean;
  /** 태그 표시 여부 */
  showTags?: boolean;
  /** 최대 표시할 태그 개수 */
  maxTags?: number;
  /** 추가 클래스명 */
  className?: string;
  /** 검색어 (하이라이팅용) */
  searchQuery?: string;
}

/**
 * 검색어 하이라이팅 함수
 */
function highlightSearchTerm(text: string, searchTerm?: string): React.ReactNode {
  if (!searchTerm?.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-primary/20 text-primary font-medium rounded px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/**
 * 블로그 포스트 카드 컴포넌트
 */
export function PostCard({
  post,
  variant = 'default',
  showCategory = true,
  showAuthor = false,
  showStats = true,
  showLikeButton = false,
  showTags = false,
  maxTags = 3,
  className = '',
  searchQuery,
}: PostCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className={`sook-card group overflow-hidden hover:shadow-2xl hover:scale-[1.025] transition-all duration-300 ${className}`}>
      <article className="relative h-full">
        {/* 커버 이미지 */}
        <div className={`relative aspect-video overflow-hidden rounded-t-2xl`}>
          {post.coverImage && !imageError ? (
            <>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={variant === 'featured'}
                onError={() => setImageError(true)}
              />
              {/* 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-100/20 via-pink-50/10 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100/60 to-pink-100/40 flex items-center justify-center rounded-t-2xl">
              <div className="text-4xl opacity-60">📝</div>
            </div>
          )}
          {/* 추천 포스트 배지 */}
          {post.featured && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-pink-400 text-white text-xs font-bold rounded-full shadow">⭐ 추천</span>
            </div>
          )}
          {/* 검색 결과 배지 */}
          {searchQuery && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow">🔍 검색 결과</span>
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            {/* 카테고리 */}
            {showCategory && post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="inline-flex items-center hover:text-pink-500 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge
                  variant="secondary"
                  className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
                >
                  {post.category.name}
                </Badge>
              </Link>
            )}
            {/* 제목 */}
            <h3 className={`text-lg font-bold line-clamp-2 group-hover:text-purple-600 transition-colors`}>{highlightSearchTerm(post.title, searchQuery)}</h3>
            {/* 요약 */}
            <p className="text-purple-500 line-clamp-3 text-sm">{highlightSearchTerm(post.excerpt, searchQuery)}</p>
            {/* 메타 정보 (날짜, 조회수) */}
            <div className="flex items-center gap-4 text-xs text-purple-400">
              {/* 날짜 */}
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                <time dateTime={new Date(post.publishedAt).toISOString()}>
                  {new Date(post.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              {/* 조회수 */}
              {showStats && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.viewCount || 0}</span>
                </div>
              )}
            </div>
            {/* 태그 */}
            {showTags && post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-4">
                {post.tags.slice(0, maxTags).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    #{highlightSearchTerm(tag, searchQuery)}
                  </Link>
                ))}
                {post.tags.length > maxTags && (
                  <span className="px-2 py-1 text-xs text-purple-300">+{post.tags.length - maxTags}</span>
                )}
              </div>
            )}
          </div>
          {/* 하단 정보 */}
          { (showAuthor || showLikeButton) && (
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-purple-100">
              {/* 작성자 */}
              {showAuthor && post.author && (
                <div className="flex items-center gap-2">
                  {post.author.profileImage ? (
                    <Image
                      src={post.author.profileImage}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="rounded-full border border-purple-100"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-500">
                      {post.author.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{post.author.name}</span>
                </div>
              )}
              {/* 좋아요 버튼 */}
              {showLikeButton && (
                <LikeButton postId={post.id} initialLikes={post.likeCount} />
              )}
            </div>
          )}
        </CardContent>
        {/* 전체 카드 링크 */}
        <Link
          href={`/posts/${post.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`${post.title} 포스트 읽기`}
        />
      </article>
    </Card>
  );
}

// 기본 export도 유지
export default PostCard;

/**
 * 추천 포스트 카드 (featured 변형)
 */
export function FeaturedPostCard({ post, ...props }: Omit<PostCardProps, 'variant'>) {
  return (
    <PostCard
      post={post}
      variant="featured"
      showTags={true}
      maxTags={4}
      {...props}
    />
  );
}

/**
 * 컴팩트 포스트 카드 (compact 변형)
 */
export function CompactPostCard({ post, ...props }: Omit<PostCardProps, 'variant'>) {
  return (
    <PostCard
      post={post}
      variant="compact"
      showStats={false}
      {...props}
    />
  );
}

/**
 * 관련 포스트 카드 (compact 변형, 최소 정보)
 */
export function RelatedPostCard({ post, ...props }: Omit<PostCardProps, 'variant'>) {
  return (
    <PostCard
      post={post}
      variant="compact"
      showStats={false}
      showLikeButton={false}
      showTags={false}
      {...props}
    />
  );
} 