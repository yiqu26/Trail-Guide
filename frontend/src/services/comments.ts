import api from './api';
import type { Comment, CommentStats, CreateCommentData } from '../types';

export const commentService = {
  async getComments(trailId: number, page = 1, pageSize = 10): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`/trails/${trailId}/comments`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  async getCommentStats(trailId: number): Promise<CommentStats> {
    const response = await api.get<CommentStats>(`/trails/${trailId}/comments/stats`);
    return response.data;
  },

  async createComment(trailId: number, data: CreateCommentData): Promise<Comment> {
    const response = await api.post<Comment>(`/trails/${trailId}/comments`, data);
    return response.data;
  },

  async deleteComment(trailId: number, commentId: number): Promise<void> {
    await api.delete(`/trails/${trailId}/comments/${commentId}`);
  },

  async likeComment(trailId: number, commentId: number): Promise<{ likeCount: number; isLiked: boolean }> {
    const response = await api.post<{ likeCount: number; isLiked: boolean }>(
      `/trails/${trailId}/comments/${commentId}/like`
    );
    return response.data;
  },
};
