import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

export function GameImage(props: ImageProps) {
  const { src, alt, ...rest } = props;
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 默认图片（占位图），原图加载完成后隐藏 */}
      {!loaded && (
        <Image
          src="/images/default-game.svg"
          alt="默认图片"
          fill
          style={{ objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 1 }}
          draggable={false}
        />
      )}
      {/* 原图，加载完成后显示 */}
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: 'cover',
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        {...rest}
      />
    </div>
  );
} 