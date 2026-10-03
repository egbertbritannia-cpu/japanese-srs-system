import Image from 'next/image';
import artManifest from '../../../public/assets/art/art-manifest.json';

export interface JapaneseArtBackdropProps {
  src: string;
  alt: string;
  opacity?: number;
  blendMode?: 'multiply' | 'overlay' | 'soft-light' | 'screen' | 'normal';
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
  className?: string;
  zIndex?: number;
  priority?: boolean;
}

/**
 * JapaneseArtBackdrop
 * Reusable component for overlaying authentic Japanese cultural art & ukiyo-e motifs.
 * Features:
 * - Tự động phát hiện phiên bản nén AVIF siêu nhẹ
 * - Tự động nạp mã làm mờ Base64 (LQIP) để chống giật hình ảnh
 * - Guaranteed non-blocking interactions via pointer-events-none
 * - Granular opacity and CSS mix-blend-mode controls
 * - Built-in responsive Next.js Image handling
 */
export function JapaneseArtBackdrop({
  src,
  alt,
  opacity = 0.2,
  blendMode = 'multiply',
  objectFit = 'cover',
  objectPosition = 'center',
  className = '',
  zIndex = 1,
  priority = false,
}: JapaneseArtBackdropProps) {
  // Lấy tên tệp gốc để tra cứu manifest
  const fileName = src.split('/').pop() || '';
  const manifestEntry = (artManifest as Record<string, any>)[fileName];
  const blurUrl = manifestEntry?.blurDataUrl;

  // Tự động chuyển sang định dạng AVIF nếu có sẵn trong manifest
  const optimizedSrc = manifestEntry?.avif?.name
    ? `/assets/art/${manifestEntry.avif.name}`
    : src;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex }}
      aria-hidden="true"
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder={blurUrl ? 'blur' : 'empty'}
        blurDataURL={blurUrl}
        style={{
          objectFit,
          objectPosition,
          opacity,
          mixBlendMode: blendMode,
        }}
        priority={priority}
      />
    </div>
  );
}

export default JapaneseArtBackdrop;
