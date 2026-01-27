import api from './api';
import { mockHomeData, mockTrails } from './mockData';
import type { HomeData, CollectionDetail, Announcement } from '../types';

// 開發模式下使用 mock 數據
const USE_MOCK = import.meta.env.DEV;

export const homeService = {
  async getHomeData(): Promise<HomeData> {
    try {
      const response = await api.get<HomeData>('/home');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      if (USE_MOCK) {
        return mockHomeData;
      }
      throw error;
    }
  },

  async getCollection(id: number): Promise<CollectionDetail> {
    try {
      const response = await api.get<CollectionDetail>(`/home/collections/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      if (USE_MOCK) {
        const collection = mockHomeData.collections.find(c => c.id === id);
        return {
          id: collection?.id || id,
          name: collection?.name || '精選集',
          subTitle: collection?.subTitle,
          iconImage: collection?.iconImage,
          trails: mockTrails.slice(0, 3),
        };
      }
      throw error;
    }
  },

  async getAnnouncements(page = 1, pageSize = 10): Promise<Announcement[]> {
    try {
      const response = await api.get<Announcement[]>('/home/announcements', {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      if (USE_MOCK) {
        return mockHomeData.announcements;
      }
      throw error;
    }
  },
};
