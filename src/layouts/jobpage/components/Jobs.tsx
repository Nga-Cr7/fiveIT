import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { JobModel } from "../../../models/JobModel";
import { useAuth } from "../../utils/AuthProvide";
import { ProfileModel } from "../../../models/ProfileModel";
import { useTranslation } from 'react-i18next';

export const Jobs: React.FC<{ job: JobModel }> = (props) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [profile, setProfile] = useState<ProfileModel>();
  const [isLoading, setIsLoading] = useState(true);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isIconDisabled, setIsIconDisabled] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();



  const jobId = props.job.jobId;

  const jobDetailLink = `/jobDetail/${jobId}`;



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
          const btnDisabled = profile.favoriteJobs.some((item) => item.jobId === props.job.jobId);
          setIsIconDisabled(btnDisabled);
        }
      } catch (error) {
        console.log("Error fetching API:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, []);

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
          // setApplicantByUser(list);
          const btnDisabled = list.some((item: { jobId: number }) => item.jobId === props.job.jobId);
          setIsButtonDisabled(btnDisabled);
        }
      } catch (error) {
        console.log("Error fetching API:", error);
      }
    };

    if (user) {
      fetchApply();
    }
  }, []);

  function checkApply(jobId: any) {
    if (user === null) {
      showToastMessage(t('showToastMessage.pleaseLogin'));
      return;
    }
    navigate(`${jobDetailLink}?applyNow=open`);
  }


  // Function to toggle favorite status
  const toggleFavorite = async () => {
    if (user === null) {
      showToastMessage(t('showToastMessage.pleaseLogin'));
      return;
    }
    try {
      if (isIconDisabled) {
        await actionFavoriteJob();
        setIsIconDisabled(false);
      } else {
        await actionFavoriteJob();
        setIsIconDisabled(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const actionFavoriteJob = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };
      const formData = new FormData();
      formData.append('jobId', jobId ? jobId.toString() : '');
      const response = await fetch("http://localhost:8080/auth/actionFavoriteJob", {
        method: 'POST',
        headers,
        body: formData,
      });
      if (response.ok) {
        const message = await response.text();
        if (message == "Add success") {
          showToastMessage(`${t('showToastMessage.add')} ${props.job.title} ${t('showToastMessage.successFavorite')}`);
        } else {
          showToastMessage(`${t('showToastMessage.remove')} ${props.job.title} ${t('showToastMessage.successFavorite')}`);
        }
      } else {
        console.error('Failed to toggle favorite');
        // throw new Error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error favoriting/unfavoriting job:', error);
      throw error;
    }
  };

  function padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  function formatDateTime(dateTimeString: any) {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = padZero(dateTime.getMonth() + 1);
    const day = padZero(dateTime.getDate());
    const hours = padZero(dateTime.getHours());
    const minutes = padZero(dateTime.getMinutes());
    const seconds = padZero(dateTime.getSeconds());
    return `${year}-${month}-${day}`;
  }


  const handleToastClick = () => {
    const currentPath = location.pathname;
    localStorage.setItem('redirectToPage', currentPath);
    navigate('/login');
  };


  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);

    if (message == t('showToastMessage.pleaseLogin')) {
      handleToastClick();
    }

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };




  return (
    <>
      <div className="job-item p-4 mb-4">
        <div className="row g-4">
          <div className="col-sm-12 col-md-8 d-flex align-items-center">
            {props.job.jobImg ? (
              <img
                className="flex-shrink-0 img-fluid border rounded"
                src={props.job.jobImg}
                alt=""
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            ) : (
              <img
                className="flex-shrink-0 img-fluid border rounded"
                src="../assets/img/com-logo-1.jpg"
                alt=""
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            )}
            <Link
              to={jobDetailLink}
              className="text-start ps-4"
            >
              <h6 className="mb-3">{props.job.title}</h6>
              <span className="text-truncate me-3">
                <i className="fa fa-map-marker-alt text-primary me-2"></i>
                {props.job.jobCategory.categoryName}
              </span>

              <span className="text-truncate me-3">
                <i className="far fa-clock text-primary me-2"></i>Full Time
              </span>
              <span className="text-truncate me-0">
                <i className="far fa-money-bill-alt text-primary me-2"></i>${" "}
                {props.job.salary}
              </span>
            </Link>
          </div>
          <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
            <div className="d-flex mb-3">

              {isIconDisabled ? (
                <button className="btn btn-square me-3" onClick={toggleFavorite}>
                  <i className="fas fa-heart text-primary"></i>
                </button>
              ) : (
                <button className="btn btn-square me-3" onClick={toggleFavorite}>
                  <i className="far fa-heart text-primary"></i>
                </button>
              )}
              {isButtonDisabled ? (
                <button className="btn btn-warning" style={{ width: '110px' }} disabled>
                  {t('btn.btnApplied')}
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => checkApply(props.job.jobId)}
                >
                  {t('btn.btnApply')}
                </button>
              )}
            </div>
            <small className="text-truncate">
              <i className="far fa-calendar-alt text-primary me-2"></i>
              {formatDateTime(props.job.createdAt)}
            </small>
          </div>
        </div>

        {showToast && (
          <>
            <div className="position-fixed top-0 end-0 p-3 toast-message" style={{ zIndex: "9999" }}>
              <div
                className={`toast ${showToast ? "show" : ""}`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div className="toast-header" style={{ backgroundColor: '#198754', color: 'white' }}>
                  <strong className="me-auto">{t('showToastMessage.status')}</strong>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="toast"
                    onClick={() => setShowToast(false)}
                  ></button>
                </div>
                <div className="toast-body">{message}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
