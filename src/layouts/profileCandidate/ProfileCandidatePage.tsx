import { useEffect, useState } from "react";
import { ProfileCandidateInfor } from "./component/ProfileCandidateInfor";
import { ProfileCandidateForm } from "./component/ProfileCandidateForm";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { useAuth } from "../utils/AuthProvide";
import jwt_decode from 'jwt-decode';
import { ProfileModel } from "../../models/ProfileModel";
import { ApplicantModel } from "../../models/ApplicantModel";
import { useTranslation } from 'react-i18next';
export const ProfileCandidatePage = () => {
  const { t } = useTranslation();
  localStorage.removeItem("jobCate");
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileModel>();
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/profile/loadProfile", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          const profile = new ProfileModel(
            profileData.profileType,
            profileData.name,
            profileData.email,
            profileData.userImage,
            profileData.userCv,
            profileData.gender,
            profileData.phoneNumber,
            profileData.address,
            profileData.bio,
            profileData.companyName,
            profileData.companyLogo,
            profileData.companyImg1,
            profileData.companyImg2,
            profileData.companyImg3,
            profileData.taxNumber,
            profileData.specializationNames, // Pass specialization names as an array
            profileData.favoriteJobs // Pass specialization names as an array
          );
          setProfile(profile);
        }
      } catch (error) {
        console.log("Error fetching API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [applicantByUser, setApplicantByUser] = useState<ApplicantModel[]>([]);

  useEffect(() => {
    const fetchApply = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/loadApply", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (response.ok) {
          const list = await response.json();
          setApplicantByUser(list);
          
        }
      } catch (error) {
        console.log("Error fetching API:", error);
      }
    };

    if (user) {
      fetchApply();
    }
  }, []);



  if (isLoading) {
    return (
      <SpinnerLoading />
    );
  }
  const updateProfile = (newProfile: ProfileModel) => {
    setProfile(newProfile);
  }

  return (
    <>

      <div className="container">
      <br />
        <div className="row mt-3">

          {/* infor */}
          <div className="col-md-5">
            <ProfileCandidateInfor profile={profile} applicant={applicantByUser} />
          </div>

          {/* form */}
          <div className="col-md-7">
            <ProfileCandidateForm profile={profile} updateProfile={updateProfile} />
          </div>
        </div>

      </div>
      <br />
      <br />
      <br />
    </>
  );
};
