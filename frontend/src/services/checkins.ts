import api from './api';
import type { Checkin, CreateCheckinData, CheckinResult, CheckinStats } from '../types';

export const checkinService = {
  /**
   * 建立打卡
   */
  async createCheckin(data: CreateCheckinData): Promise<CheckinResult> {
    const response = await api.post<CheckinResult>('/checkins', data);
    return response.data;
  },

  /**
   * 我的打卡紀錄
   */
  async getMyCheckins(page = 1, pageSize = 20): Promise<Checkin[]> {
    const response = await api.get<Checkin[]>('/checkins', {
      params: { page, pageSize },
    });
    return response.data;
  },

  /**
   * 我的打卡統計
   */
  async getMyStats(): Promise<CheckinStats> {
    const response = await api.get<CheckinStats>('/checkins/stats');
    return response.data;
  },

  /**
   * 刪除打卡
   */
  async deleteCheckin(id: number): Promise<void> {
    await api.delete(`/checkins/${id}`);
  },

  /**
   * 步道打卡紀錄
   */
  async getTrailCheckins(trailId: number, page = 1, pageSize = 20): Promise<Checkin[]> {
    const response = await api.get<Checkin[]>(`/trails/${trailId}/checkins`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  /**
   * 步道打卡統計
   */
  async getTrailCheckinStats(trailId: number): Promise<{
    totalCheckins: number;
    uniqueUsers: number;
    verifiedCheckins: number;
    averageDuration: number;
  }> {
    const response = await api.get(`/trails/${trailId}/checkins/stats`);
    return response.data;
  },
};

export default checkinService;
