/**
 * 이미지 업로드 컴포넌트
 * 블로그 게시물의 커버 이미지 업로드를 위한 UI 제공
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Check, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useImageUpload, formatFileSize, isImageFile } from '@/lib/upload-image';

// ========================================
// 타입 정의
// ========================================

/**
 * 업로드 상태 타입
 */
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

/**
 * ImageUpload 컴포넌트 Props
 */
interface ImageUploadProps {
  /** 업로드 완료 시 호출되는 콜백 함수 */
  onImageUploaded: (url: string) => void;
  /** 이미지 제거 시 호출되는 콜백 함수 */
  onImageRemoved?: () => void;
  /** 초기 이미지 URL (수정 시 사용) */
  initialImage?: string | null;
  /** 추가 CSS 클래스 */
  className?: string;
}

// ========================================
// 메인 컴포넌트
// ========================================

/**
 * 이미지 업로드 컴포넌트
 * 
 * @param props - ImageUploadProps
 * @returns JSX.Element
 */
export default function ImageUpload({
  onImageUploaded,
  onImageRemoved,
  initialImage,
  className = ''
}: ImageUploadProps) {
  // ========================================
  // 상태 관리
  // ========================================
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // ========================================
  // Refs 및 Hooks
  // ========================================
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useImageUpload();

  // ========================================
  // 초기 이미지 설정
  // ========================================
  
  useEffect(() => {
    if (initialImage && !previewUrl) {
      setPreviewUrl(initialImage);
    }
  }, [initialImage, previewUrl]);

  // ========================================
  // 이벤트 핸들러
  // ========================================

  /**
   * 파일 선택 버튼 클릭 핸들러
   */
  const handleSelectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  /**
   * 파일 선택 변경 핸들러
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files?.[0];
    
    if (!file) return;

    // 파일 형식 검증
    if (!isImageFile(file)) {
      setErrorMessage('지원되지 않는 파일 형식입니다. JPG, PNG, GIF, WebP 파일만 업로드 가능합니다.');
      setUploadStatus('error');
      return;
    }

    // 파일 크기 검증 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrorMessage(`파일 크기가 너무 큽니다. ${formatFileSize(maxSize)} 이하의 파일을 선택해주세요.`);
      setUploadStatus('error');
      return;
    }

    // 상태 초기화
    setErrorMessage('');
    setUploadStatus('idle');
    setSelectedFile(file);

    // 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // 파일을 선택하자마자 업로드 시작 로직을 useEffect로 이동
    // handleUpload(); // 이 줄은 제거합니다.
  };

  // selectedFile 상태가 변경될 때 업로드 시작
  useEffect(() => {
    if (selectedFile) {
      handleUpload();
    }
  }, [selectedFile]);

  /**
   * 업로드 버튼 클릭 핸들러
   */
  const handleUpload = async () => {
    console.log('📤 handleUpload 시작');
    console.log('선택된 파일:', selectedFile);

    if (!selectedFile) {
      console.log('업로드할 파일이 없습니다.');
      return;
    }

    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      setErrorMessage('');

      // 진행률 시뮬레이션 (실제 진행률은 Supabase에서 제공하지 않음)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 이미지 업로드 실행
      const result = await uploadImage(selectedFile);

      // 진행률 완료
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.url) {
        console.log('✅ 이미지 업로드 성공, URL:', result.url);
        onImageUploaded(result.url);
        setUploadStatus('success');
        
        // 성공 메시지 표시 후 상태 초기화
        setTimeout(() => {
          setUploadStatus('idle');
          setUploadProgress(0);
        }, 2000);
      } else {
        console.error('❌ 이미지 업로드 실패, 오류:', result.error);
        setUploadStatus('error');
        setErrorMessage(result.error || '업로드에 실패했습니다.');
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('업로드 중 오류가 발생했습니다:', error);
      setUploadStatus('error');
      setErrorMessage('업로드 중 오류가 발생했습니다.');
      setUploadProgress(0);
    }
  };

  /**
   * 이미지 제거 핸들러
   */
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadStatus('idle');
    setErrorMessage('');
    setUploadProgress(0);
    
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // 부모 컴포넌트에 이미지 제거 알림
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  // ========================================
  // 렌더링 헬퍼 함수
  // ========================================

  /**
   * 업로드 상태에 따른 버튼 텍스트 반환
   */
  const getUploadButtonText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return '업로드 중...';
      case 'success':
        return '업로드 완료!';
      case 'error':
        return '다시 시도';
      default:
        return '업로드';
    }
  };

  /**
   * 업로드 상태에 따른 버튼 아이콘 반환
   */
  const getUploadButtonIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Upload className="w-4 h-4" />;
    }
  };

  // ========================================
  // 메인 렌더링
  // ========================================

  return (
    <div className={`relative ${className}`}>
      {/* 파일 입력 (숨김) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 이미지 미리보기 */}
      {previewUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
          <img
            src={previewUrl}
            alt="미리보기"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="이미지 제거"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 업로드 버튼 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSelectClick}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
          {previewUrl ? '다른 이미지 선택' : '이미지 선택'}
        </button>
      </div>

      {/* 에러 메시지 */}
      {errorMessage && (
        <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 진행률 표시 */}
      {uploadStatus === 'uploading' && (
        <div className="mt-2">
          <div className="h-1 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-purple-600 mt-1 text-right">
            {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
} 