export class UserModel {
    userId: number;
    userName: string;
    phoneNumber: string;
    email: string;
    status: string;

    constructor(
        userId: number,
        userName: string,
        phoneNumber: string,
        email: string,
        status: string
    ) {
        this.userId = userId;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.status = status;
    }
}