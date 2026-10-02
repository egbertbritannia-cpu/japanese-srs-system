import Image from 'next/image';

export interface JapaneseArtBackdropProps {
  src: string;
  alt: string;
  opacity?: number;
  blendMode?: 'multiply' | 'overlay' | 'soft-light' | 'screen' | 'normal';
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
  className?: string;
  zIndex?: number;
}

/**
 * JapaneseArtBackdrop
 * Reusable component for overlaying authentic Japanese cultural art & ukiyo-e motifs.
 * Features:
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
}: JapaneseArtBackdropProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex }}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        style={{
          objectFit,
          objectPosition,
          opacity,
          mixBlendMode: blendMode,
        }}
        priority={false}
      />
    </div>
  );
}

export default JapaneseArtBackdrop;
