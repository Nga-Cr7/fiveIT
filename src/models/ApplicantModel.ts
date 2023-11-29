import { JobModel } from "./JobModel";
import { UserModel } from "./UserModel";

export class ApplicantModel {
    applicantId: number;

    job: JobModel | null;

    user: UserModel;

    fullName: string;

    email: string;

    phoneNumber: string;

    cv: string;

    coverletter: string;

    status: string;

    createdAt: string;

    message: string

    constructor(
        applicantId: number,

        job: JobModel,
    
        user: UserModel,
    
        fullName: string,

        email: string,

        phoneNumber: string,

        cv: string,

        coverletter: string,

        status: string,

        createdAt: string,

        message: string,
    
    ) {
        this.applicantId = applicantId;
        this.job = job;
        this.user = user;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.cv = cv;
        this.coverletter = coverletter;
        this.status = status;
        this.createdAt = createdAt;
        this.message = message;
    }
}

