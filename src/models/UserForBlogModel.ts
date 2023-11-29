export class UserForBlogModel {
    userId: number;
    userName: string;

    constructor(
        userId: number,
        userName: string,
        
    ) {
        this.userId = userId;
        this.userName = userName;
    }
}