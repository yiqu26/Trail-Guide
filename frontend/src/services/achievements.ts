import api from './api';
import type { Achievement, MyAchievements, AchievementCategoryStats } from '../types';

export const achievementService = {
  /**
   * 所有成就列表（公開）
   */
  async getAllAchievements(): Promise<Achievement[]> {
    const response = await api.get<Achievement[]>('/achievements');
    return response.data;
  },

  /**
   * 我的成就狀態與進度
   */
  async getMyAchievements(): Promise<MyAchievements> {
    const response = await api.get<MyAchievements>('/achievements/my');
    return response.data;
  },

  /**
   * 成就類別統計
   */
  async getCategoryStats(): Promise<AchievementCategoryStats[]> {
    const response = await api.get<AchievementCategoryStats[]>('/achievements/categories');
    return response.data;
  },

  /**
   * 單一成就詳情
   */
  async getAchievement(id: number): Promise<Achievement> {
    const response = await api.get<Achievement>(`/achievements/${id}`);
    return response.data;
  },
};

export default achievementService;
