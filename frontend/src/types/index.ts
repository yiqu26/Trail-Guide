// Auth
export interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: number;
  expireTime: number;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  gender?: boolean;
  phoneNumber?: string;
  birth?: string;
  countyName?: string;
  stats?: UserStats;
}

export interface UserStats {
  favoritesCount: number;
  commentsCount: number;
}

export interface UpdateProfileData {
  name?: string;
  gender?: boolean;
  phoneNumber?: string;
  birth?: string;
  avatar?: string;
}

// Trail
export interface TrailListItem {
  id: number;
  title: string;
  coverImage?: string;
  difficulty?: number;
  evaluation?: number;
  distance?: number;
  costTime?: number;
  locationName?: string;
  chips: string[];
  isFavorite: boolean;
}

export interface TrailDetail {
  id: number;
  title: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  coverImage?: string;
  difficulty?: number;
  evaluation?: number;
  altitude?: number;
  class?: string;
  costTime?: number;
  roadStatus?: string;
  intro?: string;
  trailStatus?: string;
  locationName?: string;
  countyName?: string;
  classificationName?: string;
  images: string[];
  chips: string[];
  trailHeads: TrailHead[];
  attractions: Attraction[];
  commentCount: number;
  favoriteCount: number;
  isFavorite: boolean;
}

export interface TrailHead {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  bannerImage?: string;
  description?: string;
}

export interface Attraction {
  id: number;
  category?: string;
  title: string;
  link?: string;
  latitude?: number;
  longitude?: number;
}

export interface NearbyTrail {
  id: number;
  title: string;
  coverImage?: string;
  difficulty?: number;
  evaluation?: number;
  distanceKm: number;
}

// Home
export interface HomeData {
  banners: Banner[];
  collections: Collection[];
  popularTrails: TrailListItem[];
  announcements: Announcement[];
}

export interface Banner {
  id: number;
  title?: string;
  imageUrl: string;
  link?: string;
}

export interface Collection {
  id: number;
  name: string;
  subTitle?: string;
  iconImage?: string;
  trailCount: number;
}

export interface CollectionDetail {
  id: number;
  name: string;
  subTitle?: string;
  iconImage?: string;
  trails: TrailListItem[];
}

export interface Announcement {
  id: number;
  title: string;
  imageUrl?: string;
  date?: string;
  source?: string;
  link?: string;
}

// Search
export interface TrailSearchParams {
  keyword?: string;
  classificationId?: number;
  countyId?: number;
  minDifficulty?: number;
  maxDifficulty?: number;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  page?: number;
  pageSize?: number;
}

// Lookups
export interface County {
  id: number;
  name: string;
}

export interface Classification {
  id: number;
  name: string;
}

// Comments
export interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  star?: number;
  difficulty?: number;
  beauty?: number;
  content?: string;
  date?: string;
  createdAt: string;
  images: string[];
  likeCount: number;
  isLiked: boolean;
}

export interface CommentStats {
  totalCount: number;
  averageStar: number;
  averageDifficulty: number;
  averageBeauty: number;
}

export interface CreateCommentData {
  star?: number;
  difficulty?: number;
  beauty?: number;
  content?: string;
  date?: string;
}
