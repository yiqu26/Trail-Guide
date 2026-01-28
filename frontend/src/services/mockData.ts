import type { HomeData, TrailListItem, TrailDetail } from '../types';

// 使用 Unsplash 的免費步道圖片
const trailImages = {
  xiangshan: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
  trail1: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
  trail2: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800',
  trail3: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
  waterfall: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800',
  banner1: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
  banner2: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
  banner3: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200',
};

export const mockTrails: TrailListItem[] = [
  {
    id: 1,
    title: '象山步道',
    coverImage: trailImages.xiangshan,
    difficulty: 2,
    evaluation: 4.5,
    distance: 2200,
    costTime: 60,
    locationName: '台北市信義區',
    chips: ['夜景', '親子友善'],
    isFavorite: false,
  },
  {
    id: 2,
    title: '二子坪步道',
    coverImage: trailImages.forest,
    difficulty: 1,
    evaluation: 4.8,
    distance: 1700,
    costTime: 40,
    locationName: '台北市北投區',
    chips: ['無障礙', '親子友善', '森林浴'],
    isFavorite: false,
  },
  {
    id: 3,
    title: '報時山步道',
    coverImage: trailImages.trail1,
    difficulty: 1,
    evaluation: 4.6,
    distance: 600,
    costTime: 20,
    locationName: '新北市瑞芳區',
    chips: ['海景', '輕鬆'],
    isFavorite: false,
  },
  {
    id: 4,
    title: '內洞森林遊樂區',
    coverImage: trailImages.waterfall,
    difficulty: 2,
    evaluation: 4.7,
    distance: 2000,
    costTime: 90,
    locationName: '新北市烏來區',
    chips: ['瀑布', '森林浴', '負離子'],
    isFavorite: false,
  },
  {
    id: 5,
    title: '七星山主峰',
    coverImage: trailImages.mountain,
    difficulty: 3,
    evaluation: 4.4,
    distance: 4400,
    costTime: 150,
    locationName: '台北市北投區',
    chips: ['日出', '登頂', '挑戰'],
    isFavorite: false,
  },
];

export const mockHomeData: HomeData = {
  banners: [
    {
      id: 1,
      title: '探索台灣最美步道',
      imageUrl: trailImages.banner1,
      link: '/search',
    },
    {
      id: 2,
      title: '春季賞花推薦',
      imageUrl: trailImages.banner2,
      link: '/collection/1',
    },
    {
      id: 3,
      title: '親子步道精選',
      imageUrl: trailImages.banner3,
      link: '/collection/2',
    },
  ],
  collections: [
    {
      id: 1,
      name: '新手入門',
      subTitle: '輕鬆好走',
      iconImage: trailImages.forest,
      trailCount: 12,
    },
    {
      id: 2,
      name: '親子同遊',
      subTitle: '全家出遊',
      iconImage: trailImages.trail2,
      trailCount: 8,
    },
    {
      id: 3,
      name: '絕美夜景',
      subTitle: '城市燈火',
      iconImage: trailImages.xiangshan,
      trailCount: 5,
    },
    {
      id: 4,
      name: '瀑布秘境',
      subTitle: '清涼消暑',
      iconImage: trailImages.waterfall,
      trailCount: 6,
    },
    {
      id: 5,
      name: '登山挑戰',
      subTitle: '百岳入門',
      iconImage: trailImages.mountain,
      trailCount: 10,
    },
    {
      id: 6,
      name: '海濱步道',
      subTitle: '聽海漫步',
      iconImage: trailImages.trail3,
      trailCount: 7,
    },
  ],
  popularTrails: mockTrails,
  announcements: [
    {
      id: 1,
      title: '陽明山國家公園步道整修公告',
      date: '2026-01-25',
      source: '國家公園署',
    },
    {
      id: 2,
      title: '春節期間熱門步道交通管制',
      date: '2026-01-20',
      source: '交通部',
    },
    {
      id: 3,
      title: '新增 5 條無障礙友善步道',
      date: '2026-01-15',
      source: 'Trail Guide',
    },
  ],
};

export const mockTrailDetail: TrailDetail = {
  id: 1,
  title: '象山步道',
  latitude: 25.0275,
  longitude: 121.5706,
  distance: 2200,
  coverImage: trailImages.xiangshan,
  difficulty: 2,
  evaluation: 4.5,
  altitude: 183,
  class: '郊山步道',
  costTime: 60,
  roadStatus: '石階步道，維護良好',
  intro: '象山步道是台北市最受歡迎的登山步道之一，可俯瞰台北101與市區美景，是拍攝夜景的熱門地點。\n\n步道規劃完善，沿途設有涼亭休息區，適合全家大小。建議傍晚時分前往，可同時欣賞日落與夜景。',
  trailStatus: '全線開放',
  locationName: '信義區',
  countyName: '台北市',
  classificationName: '郊山步道',
  images: [
    trailImages.xiangshan,
    trailImages.trail1,
    trailImages.trail2,
  ],
  chips: ['夜景', '親子友善', '攝影熱點'],
  trailHeads: [
    {
      id: 1,
      name: '象山親山步道入口',
      latitude: 25.0275,
      longitude: 121.5706,
      description: '捷運象山站 2 號出口步行約 10 分鐘',
    },
    {
      id: 2,
      name: '永春崗公園入口',
      latitude: 25.0260,
      longitude: 121.5720,
      description: '較陡但距離較短',
    },
  ],
  attractions: [
    {
      id: 1,
      category: '餐廳',
      title: '象山咖啡',
      link: '#',
    },
    {
      id: 2,
      category: '景點',
      title: '台北101觀景台',
      link: '#',
    },
  ],
  commentCount: 128,
  favoriteCount: 456,
  isFavorite: false,
};

// 根據 ID 獲取 mock 步道詳情
export function getMockTrailById(id: number): TrailDetail | null {
  const trail = mockTrails.find(t => t.id === id);
  if (!trail) return null;

  return {
    ...mockTrailDetail,
    id: trail.id,
    title: trail.title,
    coverImage: trail.coverImage,
    difficulty: trail.difficulty,
    evaluation: trail.evaluation,
    distance: trail.distance,
    costTime: trail.costTime,
    locationName: trail.locationName,
    chips: trail.chips,
    isFavorite: trail.isFavorite,
  };
}
