import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ProfileModel } from '../../../models/ProfileModel';
import Multiselect from 'multiselect-react-dropdown';
import { useAuth } from '../../utils/AuthProvide';
import { ChangePassword } from './components/ChangePassword';
import { ProfileLogoImg } from './components/ProfileLogoImg';
import { ProfileEmployerForm } from './components/ProfileEmployerForm';
import { SpinnerLoading } from '../../utils/SpinnerLoading';
import { useTranslation } from 'react-i18next';


export const ProfileEmployerPage = () => {
  const { t } = useTranslation();
  const token: any = localStorage.getItem("jwt_token");

  const [profile, setProfile] = useState<ProfileModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [updateImg, setUpdateImg] = useState(0);
  const [updateForm, setUpdateForm] = useState(0);
  const [activeTab, setActiveTab] = useState('profile');


  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/profile/loadProfile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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
        } else {
          console.log("Error fetching API:", response.statusText);
        }
      } catch (error) {
        console.log("Error fetching API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [updateForm, updateImg]);

  const handleTabClick = (tabName: any) => {
    setActiveTab(tabName);
  };


  const updateImgProfile = (newProfile: ProfileModel) => {
    setProfile(newProfile);
    setUpdateImg((img) => img + 1);
    console.log(newProfile)
  }
  const updateFormProfile = (newProfile: ProfileModel) => {
    setProfile(newProfile);
    setUpdateForm((form) => form + 1);
    console.log(newProfile)
  }

  if (isLoading) {
    return (
      <SpinnerLoading />
    );
  }


  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid mt-3">
          <ul className="nav nav-tabs d-flex " id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleTabClick('profile')}
              > {t('profile.profile')} </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'changePassword' ? 'active' : ''}`}
                onClick={() => handleTabClick('changePassword')}
              >   {t('profile.changePassword')} </button>
            </li>
          </ul>

          <div className="tab-content" id="myTabContent">
            <div
              className={`tab-pane fade ${activeTab === 'profile' ? 'show active' : ''}`}
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <div className="row d-flex justify-content-center">
                <ProfileLogoImg profile={profile} onProfileUpdate={updateImgProfile} />
                <ProfileEmployerForm profile={profile} updateProfile={updateFormProfile} />

              </div>
            </div>
            <div
              className={`tab-pane fade ${activeTab === 'changePassword' ? 'show active' : ''}`}
              id="changePassword"
              role="tabpanel"
              aria-labelledby="changePassword-tab"
            >
              <ChangePassword />
            </div>
          </div>
        </div>
      </div>



      <style>
        {`
      .card {
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background-color: #fff;
        background-clip: border-box;
        border: 0 solid transparent;
        border-radius: .25rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%);
      }
  
      .me-2 {
        margin-right: .5rem !important;
      }
      `
        }
      </style>
    </>
  );
}