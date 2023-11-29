export class JobCategoryModel {
     categoryId: number;
     categoryName: string;
     categoryImg: string;
     createdAt: string;
     
    constructor(categoryId: number, categoryName: string,categoryImg:string, createdAt: string) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryImg = categoryImg;
        this.createdAt = createdAt;
    }
}
