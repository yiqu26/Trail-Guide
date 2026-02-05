import { useState } from 'react';
import { Box } from '@mui/material';
import { getOptimizedUrl } from '../services/cloudinary';
import { ImageLightbox } from './ImageLightbox';

interface CheckinImagesProps {
  images: string[];
  /** Height of each thumbnail */
  height?: number;
}

export function CheckinImages({
  images,
  height = 72,
}: CheckinImagesProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Horizontal scrollable strip - Strava style */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 0.5,
          // Hide scrollbar but keep functionality
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          // Smooth scrolling on touch
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {images.map((img, index) => (
          <Box
            key={index}
            component="img"
            src={getOptimizedUrl(img, { width: height * 2, height: height * 2 })}
            alt={`打卡照片 ${index + 1}`}
            onClick={() => handleImageClick(index)}
            sx={{
              height,
              width: height * 1.2,
              minWidth: height * 1.2,
              borderRadius: '4px',
              objectFit: 'cover',
              cursor: 'pointer',
              transition: 'transform 0.2s, opacity 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                opacity: 0.9,
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
            }}
          />
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
