/**
 * TypeScript Type Definitions
 * Central location for all application interfaces and types
 */

// ============================================================================
// API & Authentication Types
// ============================================================================

export interface LoginResponse {
  token: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

// ============================================================================
// Telegram Types
// ============================================================================

export interface TelegramMessage {
  id?: number;
  date: string;
  time: string;
  channel_name: string;
  content: string;
  views: number;
  comments_num: number;
}

export interface TelegramFilters {
  dateStart?: string;
  dateEnd?: string;
  channels?: string[];
  searchTerm?: string;
  minViews?: number | null;
  maxViews?: number | null;
  minComments?: number | null;
  maxComments?: number | null;
}

export interface TelegramStats {
  totalMessages?: number;
  totalChannels?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ChannelsMetadata {
  channels: string[];
}

// ============================================================================
// Twitter Types
// ============================================================================

export interface TwitterPost {
  id?: number;
  date_posted: string;
  user_posted: string;
  description: string;
  hashtags: string;
  likes: number;
  reposts: number;
  replies: number;
  views: number;
}

export interface TwitterFilters {
  description?: string;
  dateStart?: string;
  dateEnd?: string;
  users?: string[];
  user_posted?: string[];
  tagged_users?: string[];
  hashtags?: string[];
  searchTerm?: string;
  repliesMin?: number | null;
  repliesMax?: number | null;
  repostsMin?: number | null;
  repostsMax?: number | null;
  likesMin?: number | null;
  likesMax?: number | null;
  viewsMin?: number | null;
  viewsMax?: number | null;
  minReplies?: number | null;
  maxReplies?: number | null;
  minReposts?: number | null;
  maxReposts?: number | null;
  minLikes?: number | null;
  maxLikes?: number | null;
  minViews?: number | null;
  maxViews?: number | null;
}

export interface TwitterStats {
  totalPosts?: number;
  totalUsers?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface UsersMetadata {
  users: string[];
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UsePaginatedDataReturn<T> {
  data: T[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  hasFilters: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  reload: () => void;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface LoginScreenProps {
  onLogin: (isLoggedIn: boolean) => void;
}

export interface DataPreviewProps {
  dataType: 'telegram' | 'twitter';
  filters?: TelegramFilters | TwitterFilters;
}

export interface FilterModalTelegramProps {
  onToggle: () => void;
  onApplyFilters: (filters: TelegramFilters) => void;
}

export interface FilterModalTwitterProps {
  onToggle: () => void;
  onApplyFilters: (filters: TwitterFilters) => void;
}

export interface TelegramFilterInputsProps {
  filters: TelegramFilters;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleSelectAll: () => void;
  toggleChannel: (channel: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  handleAddKeyword: (keyword: string) => void;
  handleRemoveKeyword: (key: string) => void;
}

export interface TwitterFilterInputsProps {
  filters: TwitterFilters;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddFeatureItem: (feature: string, item: string) => void;
  handleRemoveItem: (feature: string, item: string) => void;
}

export interface DownloadButtonProps {
  onClick: () => void;
  isDownloading: boolean;
  label?: string;
}

export interface FilterByBtnProps {
  onClick: () => void;
  label?: string;
}

// ============================================================================
// Fetch Function Types
// ============================================================================

export type FetchFunction<T> = (
  page: number,
  limit: number,
  filters: Record<string, any>
) => Promise<PaginatedResponse<T>>;

// ============================================================================
// Utility Types
// ============================================================================

export type DataType = 'telegram' | 'twitter';

export type FilterFeature = 'user_posted' | 'tagged_users' | 'hashtags';
