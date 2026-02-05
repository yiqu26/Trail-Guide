import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getOptimizedUrl } from '../services/cloudinary';
import { ImageLightbox } from './ImageLightbox';

interface CheckinImagesProps {
  images: string[];
  /** Size of each thumbnail */
  size?: number;
  /** Maximum number of thumbnails to show before showing +N badge */
  maxVisible?: number;
}

export function CheckinImages({
  images,
  size = 60,
  maxVisible = 3,
}: CheckinImagesProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const visibleImages = images.slice(0, maxVisible);
  const remainingCount = images.length - maxVisible;

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Single image - slightly larger
  if (images.length === 1) {
    return (
      <>
        <Box
          component="img"
          src={getOptimizedUrl(images[0], { width: size * 2, height: size * 2 })}
          alt="打卡照片"
          onClick={() => handleImageClick(0)}
          sx={{
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: 2,
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 3,
            },
          }}
        />
        <ImageLightbox
          images={images}
          open={lightboxOpen}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      </>
    );
  }

  // Multiple images - grid layout
  return (
    <>
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {visibleImages.map((img, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: size,
              height: size,
              borderRadius: 1.5,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => handleImageClick(index)}
          >
            <Box
              component="img"
              src={getOptimizedUrl(img, { width: size * 2, height: size * 2 })}
              alt={`打卡照片 ${index + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Show remaining count badge on last visible image */}
            {index === maxVisible - 1 && remainingCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ color: 'white' }}
                >
                  +{remainingCount}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <ImageLightbox
        images={images}
        open={lightboxOpen}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

export default CheckinImages;
