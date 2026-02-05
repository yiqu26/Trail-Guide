import api from './api';
import type { VisitedTrail, VisitedCheck, VisitedStats } from '../types';

export const visitedService = {
  // 取得我的已去過清單
  async getMyVisited(): Promise<VisitedTrail[]> {
    const response = await api.get<VisitedTrail[]>('/visitedtrails');
    return response.data;
  },

  // 檢查某步道是否已去過
  async checkVisited(trailId: number): Promise<VisitedCheck> {
    const response = await api.get<VisitedCheck>(`/visitedtrails/check/${trailId}`);
    return response.data;
  },

  // 標記已去過
  async markVisited(trailId: number, visitedAt?: string): Promise<void> {
    await api.post(`/visitedtrails/${trailId}`, { visitedAt });
  },

  // 取消已去過
  async removeVisited(trailId: number): Promise<void> {
    await api.delete(`/visitedtrails/${trailId}`);
  },

  // 取得統計
  async getStats(): Promise<VisitedStats> {
    const response = await api.get<VisitedStats>('/visitedtrails/stats');
    return response.data;
  },
};
