import { useQuery } from '@tanstack/react-query';
import type { UnsplashImage } from '../types';

const UNSPLASH_QUERY_KEY = ['unsplash', 'background'];

async function fetchUnsplashImage(): Promise<UnsplashImage> {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new Error('Unsplash Access Key가 설정되지 않았습니다.');
  }

  const response = await fetch(
    'https://api.unsplash.com/photos/random?query=city,urban,cityscape,skyline&orientation=landscape',
    {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('이미지를 불러오는데 실패했습니다.');
  }

  return response.json();
}

export function useUnsplash() {
  const {
    data: image,
    isLoading,
    error,
  } = useQuery({
    queryKey: UNSPLASH_QUERY_KEY,
    queryFn: fetchUnsplashImage,
    staleTime: Infinity, // 새로고침 전까지 캐시 유지
    retry: 1,
  });

  return {
    image: image ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
