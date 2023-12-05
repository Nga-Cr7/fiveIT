export class UserManagementModel {
  profileType: string;
  userId: number;
  userName: string;
  email: string;
  status: string;
  approval: string;
  userImg: string | null;
  gender: string | null;
  phoneNumber: string;
  address: string | null;
  bio: string | null;
  companyName: string | null;
  companyLogo: string | null;
  taxNumber: string | null;
  companyImg1 : string | null;
  companyImg2 : string | null;
  companyImg3 : string | null;
  specializationNames: string[] | null; // Array to hold specialization names

  constructor(
    profileType: string,
    userId: number,
    userName: string,
    email: string,
    status: string,
    approval: string,
    userImg: string | null,
    gender: string | null,
    phoneNumber: string,
    address: string | null,
    bio: string | null,
    companyName: string | null,
    companyLogo: string | null,
    taxNumber: string | null,
    companyImg1: string | null,
    companyImg2: string | null,
    companyImg3: string | null,
    specializationNames: string[] |null // Add specialization names parameter
  ) {
    this.profileType = profileType;
    this.userId = userId;
    this.userName = userName;
    this.email = email;
    this.status = status;
    this.userImg = userImg;
    this.gender = gender;
    this.approval = approval;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.bio = bio;
    this.companyName = companyName;
    this.companyLogo = companyLogo;
    this.taxNumber = taxNumber;
    this.specializationNames = specializationNames; // Assign specialization names
    this.companyImg1 = companyImg1; // Assign specialization names
    this.companyImg2 = companyImg2; // Assign specialization names
    this.companyImg3 = companyImg3; // Assign specialization names
  }
}
