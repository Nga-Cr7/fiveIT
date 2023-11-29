export class BlogModel {
    blogId:number;
    blogUserId:number;
    blogTitle:string;
    blogContent:string;
    blogImg:string;
    author:string;
    status:string;
    approval:string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;

    constructor(
        blogId: number,
        blogUserId:number,
        blogTitle: string,
        blogContent: string,
        blogImg: string,
        author: string,
        status:string,
        approval:string,
        createdAt: string,
        createdBy: string,
        updatedAt: string,
        updatedBy: string,
    ) {
        this.blogId = blogId;
        this.blogUserId = blogUserId;
        this.blogTitle = blogTitle;
        this.blogContent = blogContent;
        this.blogImg = blogImg;
        this.author = author;
        this.status = status;
        this.approval = approval;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
       

    }
}