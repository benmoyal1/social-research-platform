import { Request } from 'express';
export interface JWTPayload {
    username: string;
    timestamp: number;
    iat?: number;
    exp?: number;
}
export interface AuthRequest extends Request {
    user?: JWTPayload;
}
export interface TelegramMessage {
    id: number;
    date: Date;
    time: string;
    channel_name: string;
    message_link: string;
    content: string;
    emoji_num: number;
    views: number | null;
    actual_emoji_dict: string;
    comments_num: number;
    created_at: Date;
}
export interface TelegramFilters {
    dateRange?: {
        start?: string;
        end?: string;
    };
    channels?: string[];
    minViews?: number;
    maxViews?: number;
    minEmojis?: number;
    maxEmojis?: number;
    searchText?: string;
}
export interface TelegramChannel {
    channel_name: string;
    message_count: number;
}
export interface TelegramStats {
    totalMessages: number;
    totalChannels: number;
    dateRange: {
        earliest: Date;
        latest: Date;
    };
    averageViews: number;
    totalViews: number;
}
export interface TwitterPost {
    id: number;
    date_posted: Date;
    user_posted: string;
    description: string;
    hashtags: string;
    replies: number;
    reposts: number;
    likes: number;
    views: number;
    created_at: Date;
}
export interface TwitterFilters {
    dateStart?: string;
    dateEnd?: string;
    users?: string[];
    searchTerm?: string;
    hashtags?: string[];
    minReplies?: number;
    maxReplies?: number;
    minReposts?: number;
    maxReposts?: number;
    minLikes?: number;
    maxLikes?: number;
    minViews?: number;
    maxViews?: number;
}
export interface TwitterUser {
    user_name: string;
    user_id: string;
    tweet_count: number;
}
export interface TwitterStats {
    totalTweets: number;
    totalUsers: number;
    dateRange: {
        earliest: Date;
        latest: Date;
    };
    averageLikes: number;
    totalLikes: number;
}
export interface PaginationParams {
    page: number;
    limit: number;
}
export interface PaginationResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalRecords: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
    message: string;
    token: string;
    expiresIn: string;
    username: string;
}
//# sourceMappingURL=index.d.ts.map