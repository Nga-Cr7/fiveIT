import { JobModel } from "./JobModel";
import { UserModel } from "./UserModel";

export class FavoriteJobModel {
    favoriteId: number;

    job: JobModel;

    user: UserModel;

    createdAt: string;

    constructor(
        reviewId: number,

        job: JobModel,
    
        user: UserModel,
    
        createdAt: string
    
    ) {
        this.favoriteId = reviewId;
        this.job = job;
        this.user = user;
        this.createdAt = createdAt;
    }
}

