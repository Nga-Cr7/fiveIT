import { JobCategoryModel } from "./JobCategoryModel";

export class JobModel {
    jobId: number;

    title: string;

    jobCategory: JobCategoryModel;

    userId: string | null;

    jobImg: string;

    description: string;

    requirements: string;
    
    location:string;

    salary: number;

    status: string;

    applicationDeadline: string;

    createdAt: string;

    createdBy: string;

    approval: string;


    quantityCv: number;


    constructor(
        jobId: number,
        title: string,
        jobCategory: JobCategoryModel,
        userId: string,
        jobImg: string,
        description: string,
        requirements: string,
        location: string,
        salary: number,
        status: string,
        applicationDeadline: string,
        createdAt: string,
        createdBy: string,
        approval: string,
        quantityCv: number

    ) {
        this.jobId = jobId;
        this.title = title;
        this.jobCategory = jobCategory;
        this.userId = userId;
        this.jobImg = jobImg;
        this.description = description;
        this.requirements = requirements;
        this.location = location;
        this.salary = salary;
        this.status = status;
        this.applicationDeadline = applicationDeadline;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.approval = approval;
        this.quantityCv = quantityCv;
    }
}

