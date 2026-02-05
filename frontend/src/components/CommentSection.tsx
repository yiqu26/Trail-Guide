import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Rating,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import EditIcon from '@mui/icons-material/Edit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { commentService } from '../services/comments';
import { uploadImage } from '../services/cloudinary';
import type { Comment, CommentStats, CreateCommentData } from '../types';

interface CommentSectionProps {
  trailId: number;
}

export function CommentSection({ trailId }: CommentSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Form states
  const [newComment, setNewComment] = useState<CreateCommentData>({
    star: 5,
    difficulty: 3,
    beauty: 4,
    content: '',
  });

  // Image upload states
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trailId]);

  const fetchData = async () => {
    try {
      const [commentsData, statsData] = await Promise.all([
        commentService.getComments(trailId),
        commentService.getCommentStats(trailId),
      ]);
      setComments(commentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - selectedImages.length); // Max 5 images
    setSelectedImages([...selectedImages, ...newFiles]);

    // Create preview URLs
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    // Revoke blob URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);

    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setNewComment({ star: 5, difficulty: 3, beauty: 4, content: '' });
    // Clean up blob URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreviews([]);
  };

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setIsUploading(true);

      // Upload images to Cloudinary if any
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        const uploadPromises = selectedImages.map(file =>
          uploadImage(file, 'comments')
        );
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map(r => r.secure_url);
      }

      const commentData: CreateCommentData = {
        ...newComment,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      };

      const created = await commentService.createComment(trailId, commentData);
      setComments([created, ...comments]);
      setShowAddDialog(false);
      resetForm();
      setSnackbar({ open: true, message: '評論發表成功', severity: 'success' });
      // Refresh stats
      const newStats = await commentService.getCommentStats(trailId);
      setStats(newStats);
    } catch (error) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      const message = axiosError.response?.data?.error || '發表失敗，請稍後再試';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLike = async (commentId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const result = await commentService.likeComment(trailId, commentId);
      setComments(comments.map(c =>
        c.id === commentId
          ? { ...c, likeCount: result.likeCount, isLiked: result.isLiked }
          : c
      ));
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const hasUserCommented = comments.some(c => c.userId === user?.id);

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>載入評論中...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            評論 ({stats?.totalCount || 0})
          </Typography>
          {stats && stats.totalCount > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Rating value={stats.averageStar} precision={0.1} size="small" readOnly />
              <Typography variant="body2" color="text.secondary">
                {stats.averageStar.toFixed(1)}
              </Typography>
            </Box>
          )}
        </Box>
        {!hasUserCommented && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => isAuthenticated ? setShowAddDialog(true) : navigate('/login')}
          >
            發表評論
          </Button>
        )}
      </Box>

      {/* Comments List */}
      {comments.length === 0 ? (
        <Card sx={{ bgcolor: 'action.hover' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">還沒有評論</Typography>
            <Typography variant="caption" color="text.secondary">
              成為第一個分享心得的人
            </Typography>
          </CardContent>
        </Card>
      ) : (
        comments.map((comment, index) => (
          <Box key={comment.id}>
            <Box sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar src={comment.userAvatar} sx={{ width: 40, height: 40 }}>
                  {comment.userName[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {comment.userName}
                      </Typography>
                      <Rating value={comment.star || 0} size="small" readOnly />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString('zh-TW')}
                    </Typography>
                  </Box>

                  {/* Chips for difficulty and beauty */}
                  {(comment.difficulty || comment.beauty) && (
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
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

                  {comment.content && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {comment.content}
                    </Typography>
                  )}

                  {/* Comment Images */}
                  {comment.images && comment.images.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 1.5, overflow: 'auto' }}>
                      {comment.images.map((img, i) => (
                        <Box
                          key={i}
                          component="img"
                          src={img}
                          alt=""
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                            flexShrink: 0,
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Like button */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <IconButton size="small" onClick={() => handleLike(comment.id)}>
                      {comment.isLiked ? (
                        <ThumbUpIcon fontSize="small" color="primary" />
                      ) : (
                        <ThumbUpOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                    {comment.likeCount > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {comment.likeCount}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            {index < comments.length - 1 && <Divider />}
          </Box>
        ))
      )}

      {/* Add Comment Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>發表評論</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            {/* Overall Rating */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                整體評分
              </Typography>
              <Rating
                value={newComment.star || 0}
                onChange={(_, value) => setNewComment({ ...newComment, star: value || undefined })}
                size="large"
              />
            </Box>

            {/* Difficulty */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                難度感受 (1-5)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    variant={newComment.difficulty === value ? 'filled' : 'outlined'}
                    color={newComment.difficulty === value ? 'primary' : 'default'}
                    onClick={() => setNewComment({ ...newComment, difficulty: value })}
                  />
                ))}
              </Box>
            </Box>

            {/* Beauty */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                風景評分 (1-5)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    variant={newComment.beauty === value ? 'filled' : 'outlined'}
                    color={newComment.beauty === value ? 'primary' : 'default'}
                    onClick={() => setNewComment({ ...newComment, beauty: value })}
                  />
                ))}
              </Box>
            </Box>

            {/* Content */}
            <TextField
              label="心得分享"
              multiline
              rows={4}
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              placeholder="分享你的步道體驗..."
            />

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                照片 (選填，最多 5 張)
              </Typography>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {imagePreviews.map((preview, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component="img"
                        src={preview}
                        alt={`預覽 ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          p: 0.25,
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Add Image Button */}
              {selectedImages.length < 5 && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddPhotoAlternateIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    size="small"
                  >
                    新增照片
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowAddDialog(false); resetForm(); }} disabled={isUploading}>
            取消
          </Button>
          <Button
            variant="contained"
            onClick={handleAddComment}
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isUploading ? '發表中...' : '發表'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
