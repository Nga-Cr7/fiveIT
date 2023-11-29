import { JobModel } from "./JobModel";

export class ProfileModel {
  profileType: string;
  userName: string;
  email: string;
  userImg: string | undefined;
  userCV: string | undefined;
  gender: string | undefined;
  phoneNumber: string | null;
  address: string | null;
  bio: string | null;
  companyName: string | null;
  companyLogo: string;
  companyImg1: string | null;
  companyImg2: string | null;
  companyImg3: string | null;
  taxNumber: string | null;
  specializationNames: string[]; // Array to hold specialization names
  favoriteJobs: JobModel[];

  constructor(
    profileType: string,
    userName: string,
    email: string,
    userImg: string | undefined,
    userCV: string | undefined,
    gender: string | undefined,
    phoneNumber: string | null,
    address: string | null,
    bio: string | null,
    companyName: string | null,
    companyLogo: string,
    companyImg1: string | null,
    companyImg2: string | null,
    companyImg3: string | null,
    taxNumber: string | null,
    specializationNames: string[], // Add specialization names parameter
    favoriteJobs: JobModel[]
  ) {
    this.profileType = profileType;
    this.userName = userName;
    this.email = email;
    this.userImg = userImg;
    this.userCV= userCV;
    this.gender = gender;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.bio = bio;
    this.companyName = companyName;
    this.companyLogo = companyLogo;
    this.companyImg1 = companyImg1;
    this.companyImg2 = companyImg2;
    this.companyImg3 = companyImg3;
    this.taxNumber = taxNumber;
    this.specializationNames = specializationNames; // Assign specialization names
    this.favoriteJobs = favoriteJobs; // Assign specialization names
  }
}