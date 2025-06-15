'use client';

/**
 * 게시물 수정 폼 컴포넌트
 * 기존 게시물 데이터를 불러와서 수정할 수 있는 폼
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ImageUpload from '@/components/image-upload';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// 타입 정의
interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface PostEditData {
  id: number;
  title: string;
  content: string;
  slug: string;
  coverImageUrl: string | null;
  categoryId: string;
  status: string;
}

interface PostEditFormProps {
  initialData: PostEditData;
  categories: Category[];
}

// 슬러그 생성 함수
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s\-]/g, '') // 안전한 문자만 허용
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속 하이픈 제거
    .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거
}

export default function PostEditForm({ initialData, categories }: PostEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData.title,
    content: initialData.content,
    slug: initialData.slug,
    coverImageUrl: initialData.coverImageUrl,
    categoryId: initialData.categoryId || 'none',
  });

  // 제목이 변경될 때 슬러그 자동 생성
  useEffect(() => {
    if (formData.title) {
      const newSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title]);

  // 폼 입력 핸들러
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 이미지 업로드 완료 핸들러
  const handleImageUploaded = (url: string) => {
    console.log('✅ PostEditForm: 이미지 업로드 완료 핸들러 호출됨');
    console.log('ImageUpload에서 받은 URL:', url);
    setFormData(prev => ({
      ...prev,
      coverImageUrl: url
    }));
    console.log('업데이트된 formData.coverImageUrl:', formData.coverImageUrl); // 비동기 업데이트이므로 즉시 반영되지 않을 수 있음
    toast.success('이미지가 성공적으로 업로드되었습니다');
  };

  // 이미지 제거 완료 핸들러
  const handleImageRemoved = () => {
    console.log('이미지 제거 완료');
    setFormData(prev => ({
      ...prev,
      coverImageUrl: null, // 이미지가 제거되면 null로 설정
    }));
    toast.info('이미지가 제거되었습니다');
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('=== 게시물 수정 요청 ===');

      // 폼 검증
      if (!formData.title.trim()) {
        toast.error('제목을 입력해주세요');
        return;
      }

      if (!formData.content.trim()) {
        toast.error('내용을 입력해주세요');
        return;
      }

      if (!formData.slug.trim()) {
        toast.error('슬러그가 생성되지 않았습니다');
        return;
      }

      // API 요청 데이터 준비
      const updateData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        slug: formData.slug.trim(),
        cover_image_url: formData.coverImageUrl || null,
        category_id: formData.categoryId === 'none' ? null : formData.categoryId,
        status: 'published' // 수정 시 자동으로 published 상태로 변경
      };

      console.log('📤 PostEditForm: 수정 데이터 전송 준비:', updateData);

      // PUT API 호출
      const response = await fetch(`/api/posts/${initialData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '게시물 수정에 실패했습니다');
      }

      console.log('✅ 게시물 수정 성공:', result);
      toast.success('게시물이 성공적으로 수정되었습니다');

      // 수정된 게시물 상세 페이지로 이동
      router.push(`/posts/${updateData.slug}`);
      router.refresh(); // 페이지 새로고침으로 업데이트된 내용 반영

    } catch (error) {
      console.error('게시물 수정 오류:', error);
      toast.error(error instanceof Error ? error.message : '수정 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      {/* 상단 액션 버튼 */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="flex items-center gap-4">
          <Link
            href={`/posts/${initialData.slug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                수정 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                수정 완료
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 기본 정보 섹션 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
        
        {/* 제목 */}
        <div className="space-y-2">
          <Label htmlFor="title">제목 *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="게시물 제목을 입력하세요"
            disabled={isLoading}
            className="text-lg"
          />
        </div>

        {/* 슬러그 */}
        <div className="space-y-2">
          <Label htmlFor="slug">슬러그 (URL 경로)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="url-friendly-slug"
            disabled={isLoading}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            영문 소문자, 숫자, 하이픈만 사용 가능합니다. (제목에서 자동 생성)
          </p>
        </div>

        {/* 카테고리 */}
        <div className="space-y-2">
          <Label htmlFor="category">카테고리</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => handleInputChange('categoryId', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="카테고리를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">카테고리 없음</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 커버 이미지 섹션 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">커버 이미지</h2>
        <ImageUpload
          onImageUploaded={handleImageUploaded}
          onImageRemoved={handleImageRemoved}
          initialImage={formData.coverImageUrl}
          className="w-full"
        />
      </div>

      {/* 내용 섹션 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">내용 *</h2>
        <Textarea
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="게시물 내용을 입력하세요... (Markdown 문법을 사용할 수 있습니다)"
          disabled={isLoading}
          className="min-h-[400px] font-mono text-sm"
        />
        <p className="text-xs text-gray-500">
          Markdown 문법을 사용하여 글을 작성할 수 있습니다.
        </p>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="text-sm text-gray-500">
          * 필수 입력 항목
        </div>
        
        <div className="flex items-center gap-3">
          <Link href={`/posts/${initialData.slug}`}>
            <Button type="button" variant="outline" disabled={isLoading}>
              취소
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                수정 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                수정 완료
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
} 