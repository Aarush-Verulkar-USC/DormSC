// types/review.ts
export interface Review {
    id: string;
    houseId: string;
    userId: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
    isVerified: boolean;
}

export interface CreateReviewData {
    houseId: string;
    userId: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    isVerified: boolean;
}

export interface UpdateReviewData {
    rating?: number;
    title?: string;
    comment?: string;
}
