import { useEffect, useState } from "react";
import { CompanyBanner } from "./components/CompanyBanner";
import { LeftCompanyContent } from "./components/LeftCompanyContent";
import { RightCompanyContent } from "./components/RightCompanyContent";
import { JobCategoryModel } from "../../models/JobCategoryModel";
import { JobModel } from "../../models/JobModel";
import { useAuth } from "../utils/AuthProvide";
import { ProfileModel } from "../../models/ProfileModel";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { Page404 } from "../errors/Page404";
import { Link, useLocation } from "react-router-dom";
import { UserManagementModel } from "../../models/UserManagementModel";

export const CompanyDetailPage = () => {
  const [profile, setProfile] = useState<UserManagementModel | undefined>();
  const [jobs, setJobs] = useState<JobModel[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [enable, setEnable] = useState("ENABLE");
  const [numberOfJobs, setNumberOfJobs] = useState(0);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const companyName = window.location.pathname.split("/")[2];
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");
  
  useEffect(() => {
    const jobsUrl = `http://localhost:8080/api/company/getJobByCompanyEnableApproval?userId=${userId}`;
    const profilesUrl = `http://localhost:8080/api/company/getAllEmployerApproval?companyName=${companyName}&address=${address}`;

    const fetchProfile = async () => {
      try {
        const [jobsResponse, profilesResponse] = await Promise.all([
          fetch(jobsUrl),
          fetch(profilesUrl),
        ]);

        if (jobsResponse.ok && profilesResponse.ok) {
          const [jobData, profileData] = await Promise.all([
            jobsResponse.json(),
            profilesResponse.json(),
          ]);
          const jobsList: JobModel[] = jobData.map((job: JobModel) => ({
            jobId: job.jobId,
            title: job.title,
            jobImg: job.jobImg,
            salary: job.salary,
            location: job.location,
            description: job.description,
            requirements: job.requirements,
            applicationDeadline: job.applicationDeadline,
            status: job.status,
            createdAt: job.createdAt,
            createdBy: job.createdBy,
            jobCategory: job.jobCategory,
            userId: job.userId,
            approval: job.approval,
          }));

          setJobs(jobsList);

          const numberOfJobs = jobsList.length;
          setNumberOfJobs(numberOfJobs);

          // In ra số công việc

          if (profileData.content && profileData.content.length > 0) {
            const employer = new UserManagementModel(
              profileData.content[0].profileType,
              profileData.content[0].userId,
              profileData.content[0].name, // hoặc userName
              profileData.content[0].email,
              profileData.content[0].status,
              profileData.content[0].approval,
              profileData.content[0].userImg,
              profileData.content[0].gender,
              profileData.content[0].phoneNumber,
              profileData.content[0].address,
              profileData.content[0].bio,
              profileData.content[0].companyName,
              profileData.content[0].companyLogo,
              profileData.content[0].taxNumber,
              profileData.content[0].specializationNames
            );

            setProfile(employer);
          }
        }
      } catch (error) {
        console.log("Error fetching API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  return (
    <>
      <CompanyBanner profile={profile} numberOfJobs={numberOfJobs} />

      <div className="container-xxl py-2 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="row gy-5 gx-4">
            <LeftCompanyContent
              profile={profile}
              specializationNames={profile?.specializationNames || []}
            />
            <div className="col-lg-4">
              <div className="job-list-container">
                {jobs.length > 0 ? (
                  <div
                    className="tab-className text-center wow fadeInUp"
                    data-wow-delay="0.3s"
                  >
                    {jobs.map((job) => (
                      <RightCompanyContent job={job} key={job.jobId} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="background">
                      At the moment, there are no available positions, kindly
                      await another opportunity.
                    </div>
                    <div>
                      <img
                        src="/assets/img/sorry.png"
                        className="img-fluid w-50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
        .background-div {
          background-color: #f0f0f0; /* Set your background color */
          padding: 20px; /* Add padding to style the inner content */
          border: 1px solid #ccc; /* Add a border if needed */
          border-radius: 5px; /* Optionally, add border-radius for rounded corners */
        }
        .job-list-container {
          max-height: 800px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        `}
      </style>
    </>
  );
};
