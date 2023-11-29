import { JobModel } from "./JobModel";
import { UserModel } from "./UserModel";

export class ReviewAndRatingModel {
    reviewId: number;

    job: JobModel | null;

    user: UserModel;

    rating: number;

    reviewText: string;

    createdAt: string;

    constructor(
        reviewId: number,

        job: JobModel,
    
        user: UserModel,
    
        rating: number,
    
        reviewText: string,
    
        createdAt: string
    
    ) {
        this.reviewId = reviewId;
        this.job = job;
        this.user = user;
        this.rating = rating;
        this.reviewText = reviewText;
        this.createdAt = createdAt;
    }
}

