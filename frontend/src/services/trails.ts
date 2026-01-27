import api from './api';
import { mockTrails, getMockTrailById } from './mockData';
import type { TrailListItem, TrailDetail, NearbyTrail, TrailSearchParams, County, Classification } from '../types';

// 開發模式下使用 mock 數據
const USE_MOCK = import.meta.env.DEV;

export const trailService = {
  async getTrails(params?: TrailSearchParams): Promise<TrailListItem[]> {
    try {
      const response = await api.get<TrailListItem[]>('/trails', { params });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      if (USE_MOCK) {
        let results = [...mockTrails];
        if (params?.keyword) {
          const keyword = params.keyword.toLowerCase();
          results = results.filter(t =>
            t.title.toLowerCase().includes(keyword) ||
            t.locationName?.toLowerCase().includes(keyword)
          );
        }
        return results;
      }
      throw error;
    }
  },

  async getTrailById(id: number): Promise<TrailDetail> {
    try {
      const response = await api.get<TrailDetail>(`/trails/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      if (USE_MOCK) {
        const mock = getMockTrailById(id);
        if (mock) return mock;
      }
      throw error;
    }
  },

  async getNearbyTrails(
    latitude: number,
    longitude: number,
    radiusKm = 100,
    limit = 10
  ): Promise<NearbyTrail[]> {
    try {
      const response = await api.get<NearbyTrail[]>('/trails/nearby', {
        params: { latitude, longitude, radiusKm, limit },
      });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      if (USE_MOCK) {
        // 模擬附近步道，隨機距離
        return mockTrails.slice(0, limit).map((t, i) => ({
          id: t.id,
          title: t.title,
          coverImage: t.coverImage,
          difficulty: t.difficulty,
          evaluation: t.evaluation,
          distanceKm: Math.round((i + 1) * 2.5 * 10) / 10,
        }));
      }
      throw error;
    }
  },
};

export const favoriteService = {
  async getMyFavorites(): Promise<TrailListItem[]> {
    const response = await api.get<TrailListItem[]>('/favorites');
    return response.data;
  },

  async addFavorite(trailId: number): Promise<void> {
    await api.post(`/favorites/${trailId}`);
  },

  async removeFavorite(trailId: number): Promise<void> {
    await api.delete(`/favorites/${trailId}`);
  },
};

export const lookupService = {
  async getCounties(): Promise<County[]> {
    const response = await api.get<County[]>('/trails/counties');
    return response.data;
  },

  async getClassifications(): Promise<Classification[]> {
    const response = await api.get<Classification[]>('/trails/classifications');
    return response.data;
  },
};
