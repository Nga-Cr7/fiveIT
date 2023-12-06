import { useEffect, useState } from "react";
import { JobCategoryModel } from "../../models/JobCategoryModel";
import { JobModel } from "../../models/JobModel";
import { ProfileModel } from "../../models/ProfileModel";
import { Page404 } from "../errors/Page404";
import { useAuth } from "../utils/AuthProvide";
import { Pagination } from "../utils/Pagination";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { useTranslation } from "react-i18next";
import { Jobs } from "./components/Jobs";

export function FavoritePage() {
  // Handle loading + Errors
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Handle data for jobs and jobs category
  const [jobs, setJobs] = useState<JobModel[]>([]);
  const [jobCate, setJobCate] = useState<JobCategoryModel[]>([]);

  // Handle pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(4);
  const [totalAmountOfJobs, setTotalAmountOfJobs] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const { user } = useAuth();
  const [userId, setUserId] = useState("");

  const [profile, setProfile] = useState<ProfileModel>();

  const { t } = useTranslation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/auth/profile/loadProfile",
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

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
          setJobs(profile.favoriteJobs);
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

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <Page404 error={httpError} />;
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="container-xxl py-5">
        <div className="container">
          {jobs.length > 0 ? (
            <>
              <h1
                className="text-center mb-5 wow fadeInUp"
                data-wow-delay="0.1s"
              >
               {t("favorite.favorite")}
              </h1>

              <div
                className="tab-className text-center wow fadeInUp"
                data-wow-delay="0.3s"
              >
                {jobs.length > 0 &&
                  jobs.map((job) => <Jobs job={job} key={job.jobId} />)}
              </div>
              {/* <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                paginate={paginate}
              /> */}
            </>
          ) : (
            <div className="text-center">
              <div className="background">
                <strong>{t("favorite.noFavorite")}</strong>
              </div>
              <div>
                <img
                  style={{ maxWidth: "30%" }}
                  src="/assets/img/sorry.png"
                  className="img-fluid w-30 "
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
