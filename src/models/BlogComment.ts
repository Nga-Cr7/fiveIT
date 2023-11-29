import { BlogModel } from "./BlogModel";
import { UserModel } from "./UserModel";

export class BlogComment {
    commentId: number;

    blog: BlogModel | null;

    user: UserModel;

    rating: number;

    commentText: string;

    createdAt: string;

    constructor(
        commentId: number,

        blog: BlogModel,
    
        user: UserModel,
    
        rating: number,
    
        commentText: string,
    
        createdAt: string
    
    ) {
        this.commentId = commentId;
        this.blog = blog;
        this.user = user;
        this.rating = rating;
        this.commentText = commentText;
        this.createdAt = createdAt;
    }
}

