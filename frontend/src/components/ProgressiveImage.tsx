import { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number | string | object;
  height?: number | string | object;
  borderRadius?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill';
  onClick?: () => void;
  sx?: object;
}

export function ProgressiveImage({
  src,
  alt,
  width = '100%',
  height = 200,
  borderRadius = 0,
  objectFit = 'cover',
  onClick,
  sx = {},
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        borderRadius,
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
      onClick={onClick}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius,
          }}
        />
      )}

      {/* Actual image */}
      <Box
        component="img"
        src={hasError ? '/placeholder-trail.jpg' : src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        sx={{
          width: '100%',
          height: '100%',
          objectFit,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </Box>
  );
}
