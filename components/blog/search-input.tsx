'use client';

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  initialSearchQuery?: string;
}

export function SearchInput({ initialSearchQuery = '' }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchTerm(initialSearchQuery);
  }, [initialSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (searchTerm) {
      current.set('search', searchTerm);
    } else {
      current.delete('search');
    }
    current.delete('page'); // 검색 시 페이지 초기화
    const query = current.toString();
    router.push(`${pathname}?${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="text"
        placeholder="포스트 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 pr-10 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        ref={inputRef}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        aria-label="검색"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
} 