export class ContactModel {
    contactId: number;
    contactName: string;
    contactEmail: string;
    contactSubject: string;
    contactMsg: string;
    contactCreatedAt: Date;
    contactCreatedBy: string
    contactUpdatedAt: Date | null;
    contactUpdatedBy: string | null;
    contactStatus: string;


    constructor(
        contactId: number,
        contactName:string,
        contactEmail: string,
        contactSubject: string,
        contactMsg: string,
        contactCreatedAt: Date,
        contactCreatedBy: string,
        contactUpdatedAt: Date | null,
        contactUpdatedBy: string | null,
        contactStatus: string,
    ) {
        this.contactId = contactId;
        this.contactName = contactName;
        this.contactEmail = contactEmail;
        this.contactSubject = contactSubject;
        this.contactMsg = contactMsg;
        this.contactCreatedAt = contactCreatedAt;
        this.contactCreatedBy = contactCreatedBy;
        this.contactUpdatedAt = contactUpdatedAt;
        this.contactUpdatedBy = contactUpdatedBy;
        this.contactStatus = contactStatus;
    }
}