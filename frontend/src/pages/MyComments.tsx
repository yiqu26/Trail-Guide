import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Rating,
  Chip,
  Fade,
  Grow,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useNavigate } from 'react-router-dom';
import { commentService } from '../services/comments';
import type { MyComment } from '../types';

// 空狀態元件
function EmptyState() {
  return (
    <Fade in timeout={600}>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 3,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
            }}
          />
          <CommentIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 48,
              color: '#1976D2',
            }}
          />
        </Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          還沒有發表過評論
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260, mx: 'auto' }}>
          去過步道後，分享你的體驗心得吧
        </Typography>
      </Box>
    </Fade>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Skeleton variant="rectangular" height={150} />
        </Box>
      ))}
    </Box>
  );
}

export function MyComments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState<MyComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await commentService.getMyComments();
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 2,
          pb: 2,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <CommentIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold">
          我的評論
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {comments.length} 則
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : comments.length === 0 ? (
          <EmptyState />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {comments.map((comment, index) => (
              <Grow
                key={comment.id}
                in
                timeout={400}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => navigate(`/trail/${comment.trailId}`)}
                >
                  <CardContent>
                    {/* 步道資訊 */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {comment.trailCoverImage && (
                        <Box
                          component="img"
                          src={comment.trailCoverImage}
                          alt={comment.trailTitle}
                          sx={{
                            width: 80,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 2,
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {comment.trailTitle}
                        </Typography>
                        {comment.trailLocation && (
                          <Typography variant="caption" color="text.secondary">
                            {comment.trailLocation}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* 評分 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Rating value={comment.star || 0} size="small" readOnly />
                      {(comment.difficulty || comment.beauty) && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {comment.difficulty && (
                            <Chip
                              label={`難度 ${comment.difficulty}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                          {comment.beauty && (
                            <Chip
                              label={`風景 ${comment.beauty}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>

                    {/* 內容 */}
                    {comment.content && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {comment.content}
                      </Typography>
                    )}

                    {/* 照片預覽 */}
                    {comment.images.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, overflow: 'hidden' }}>
                        {comment.images.slice(0, 3).map((img, i) => (
                          <Box
                            key={i}
                            component="img"
                            src={img}
                            alt=""
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                        ))}
                        {comment.images.length > 3 && (
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 1,
                              bgcolor: 'action.hover',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              +{comment.images.length - 3}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* 底部資訊 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleDateString('zh-TW')}
                      </Typography>
                      {comment.likeCount > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ThumbUpIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {comment.likeCount}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
