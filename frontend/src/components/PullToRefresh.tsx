import { useState, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0 && containerRef.current?.scrollTop === 0) {
        // Apply resistance to make pull feel natural
        const distance = Math.min(diff * 0.5, threshold * 1.5);
        setPullDistance(distance);
      }
    },
    [isPulling, isRefreshing, threshold]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold * 0.6); // Keep some visible indicator

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh]);

  const progress = Math.min((pullDistance / threshold) * 100, 100);

  return (
    <Box
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        position: 'relative',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Pull indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: pullDistance,
          overflow: 'hidden',
          bgcolor: 'background.default',
          transition: isPulling ? 'none' : 'height 0.3s ease-out',
          zIndex: 10,
        }}
      >
        {isRefreshing ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={24}
              sx={{
                color: progress >= 100 ? 'primary.main' : 'text.secondary',
                transition: 'color 0.2s ease',
              }}
            />
            {pullDistance > 20 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, opacity: Math.min(pullDistance / 50, 1) }}
              >
                {progress >= 100 ? '放開刷新' : '下拉刷新'}
              </Typography>
            )}
          </>
        )}
      </Box>

      {/* Content */}
      <Box
        sx={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
