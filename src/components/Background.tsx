import { memo } from 'react';
import { useUnsplash } from '../hooks/useUnsplash';

export default memo(function Background() {
  const { image, isLoading, error } = useUnsplash();

  if (error) {
    console.error('Unsplash Error:', error);
  }

  return (
    <div
      className="fixed inset-0 bg-linear-to-br from-blue-900 via-purple-900 to-pink-900 -z-10"
      style={{
        backgroundImage: image ? `url(${image.urls.full})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-white text-lg">배경 이미지 로딩 중...</div>
        </div>
      )}
      {image && (
        <div className="absolute bottom-4 right-4 text-white text-xs opacity-50">
          Photo by {image.user.name} on Unsplash
        </div>
      )}
    </div>
  );
})
