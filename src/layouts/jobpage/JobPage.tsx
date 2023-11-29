import { error } from "console";
import { JobCategoryModel } from "../../models/JobCategoryModel";
import { JobModel } from "../../models/JobModel";
import { Page404 } from "../errors/Page404";
import { Pagination } from "../utils/Pagination";
import { JobBanner } from "./components/JobBanner";
import { Jobs } from "./components/Jobs";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export function JobPage() {
  // Handle cateId for home
  const { t } = useTranslation();
  // Handle loading + Errors
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  // Handle search according to the search input
  const [search, setSearch] = useState("");

  const [selectedCate, setSelectedCate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Handle data for jobs and jobs category
  const [jobs, setJobs] = useState<JobModel[]>([]);
  const [jobCate, setJobCate] = useState<JobCategoryModel[]>([]);
  const [location, setLocation] = useState<string[]>([]);

  // Handle pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [totalAmountOfJobs, setTotalAmountOfJobs] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [searchUrl, setSearchUrl] = useState("");

  useEffect(() => {
    const fetchJobsAndCate = async () => {
      let catee = localStorage.getItem("jobCate") ?? "";
      setSelectedCate(catee)
      let baseUrlForJob = "";
      if (searchUrl === "") {
        baseUrlForJob = `http://localhost:8080/api/jobs/search/findJobsByTitleContainingAndCategoryIdAndLocationContaining?title=${search}&categoryId=${catee}&location=&page=${currentPage - 1
          }&size=${jobsPerPage}`;
      } else {
        let searchWithPage = searchUrl.replace(
          "<currentPage>",
          `${currentPage - 1}`
        );
        baseUrlForJob = searchWithPage;
      }

      const jobCateURL = "http://localhost:8080/api/jobCate";

      try {
        const [jobsResponse, jobCategoryResponse] = await Promise.all([
          fetch(baseUrlForJob),
          fetch(jobCateURL),
        ]);

        // Check if both responses are ok, and reject if any is not ok
        if (!jobsResponse.ok || !jobCategoryResponse.ok) {
          throw new Error("Something went wrong with one of the requests");
        }

        const [jobsData, jobCatesData] = await Promise.all([
          jobsResponse.json(),
          jobCategoryResponse.json(),
        ]);
        // Handle the categoriesData
        const loadedCate: JobCategoryModel[] = jobCatesData.map(
          (cate: any) => ({
            categoryId: cate.categoryId,
            categoryName: cate.categoryName,
          })
        );

        console.log("cuurrentpagech URL form USe", currentPage);

        setJobCate(loadedCate);
        const jobsDataResponse = jobsData._embedded.jobs;
        setTotalAmountOfJobs(jobsData.page.totalElements);
        setTotalPage(jobsData.page.totalPages);

        const loadedJobs: JobModel[] = [];

        for (const key in jobsDataResponse) {
          const cateInJobResponse = await fetch(
            jobsDataResponse[key]._links.jobCategory.href
          );
          if (!cateInJobResponse.ok) {
            continue;
          }
          const categInJobDataResponse = await cateInJobResponse.json();

          const cateForJob: JobCategoryModel = {
            categoryId: categInJobDataResponse.categoryId,
            categoryName: categInJobDataResponse.categoryName,
            categoryImg: categInJobDataResponse.categoryImg,
            createdAt: categInJobDataResponse.createdAt
          };

          const userLink = jobsDataResponse[key]._links.user.href;
          const userResponse = await fetch(userLink);
          if (!userResponse.ok) {
            continue;
          }
          const userDataResponse = await userResponse.json();

          const job = new JobModel(
            jobsDataResponse[key].jobId,
            jobsDataResponse[key].title,
            cateForJob,
            userDataResponse.userId,
            jobsDataResponse[key].jobImg,
            jobsDataResponse[key].description,
            jobsDataResponse[key].requirements,
            jobsDataResponse[key].location,
            jobsDataResponse[key].salary,
            jobsDataResponse[key].status,
            jobsDataResponse[key].applicationDeadline,
            jobsDataResponse[key].createdAt,
            jobsDataResponse[key].createdBy,
            jobsDataResponse[key].approval,
            jobsDataResponse[key].quantityCv,
          );
          loadedJobs.push(job);
        }

        setJobs(loadedJobs);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setHttpError(error.message);
      }
    };

    fetchJobsAndCate();
    window.scrollTo(0, 500);
  }, [currentPage, searchUrl]);

  //   useEffect loading 63 province
  useEffect(() => {
    const locationURL =
      "http://localhost:8080/provinces";

    try {
      const fetchData = () => {
        fetch(locationURL)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setLocation(data.map((item: any) => item.provinceName));
          })
          .catch((error) => {
            console.log("Error fetching data:", error);
          });
      };

      fetchData();
    } catch (error: any) {
      setIsLoading(false);
      setHttpError(error.message);
    }
  }, []);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <Page404 error={httpError} />;
  }

  const searchHandleChange = (
    searchKey: string,
    cateForSearch: string,
    locationForSearch: string
  ) => {
    setCurrentPage(1);

    console.log("search: ", searchKey);
    console.log("cateForSearch: ", cateForSearch);
    console.log("locationForSearch: ", locationForSearch);
    let newURL = `http://localhost:8080/api/jobs/search/findJobsByTitleContainingAndCategoryIdAndLocationContaining?title=${searchKey}&categoryId=${cateForSearch}&location=${locationForSearch}&page=<currentPage>&size=${jobsPerPage}`;
    setSearchUrl(newURL);
    localStorage.setItem("catee", cateForSearch);
    localStorage.removeItem("jobCate");
  };

  //back to Jobs
  //back to Jobs
  //back to Jobs

  const backToJobs = () => { };
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <JobBanner />
      {/* Search */}
      <div
        className="container-fluid bg-primary mb-5 wow fadeIn"
        data-wow-delay="0.1s"
        style={{ padding: "35px" }}
      >
        <div className="container">
          <div className="row g-2">
            <div className="col-md-10">
              <div className="row g-2">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder={t('searchForm.keyword')}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select border-0"
                    value={selectedCate}
                    onChange={(e) => setSelectedCate(e.target.value)}
                  >
                    <option value="">{t('searchForm.category')}</option>
                    {jobCate.map((cate) => (
                      <option key={cate.categoryId} value={cate.categoryId}>
                        {cate.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select border-0"
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">{t('searchForm.location')}</option>
                    {location.map((loca, index) => (
                      <option key={index} value={loca}>
                        {loca}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <button
                onClick={() =>
                  searchHandleChange(search, selectedCate, selectedLocation)
                }
                className="btn btn-dark border-0 w-100"
              >
                {t('searchForm.searchBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
          {t('job.jobBanner.pageTitle')}
          </h1>

          {jobs.length > 0 ? (
            <>
              <div
                className="tab-className text-center wow fadeInUp"
                data-wow-delay="0.3s"
              >
                {jobs.length > 0 &&
                  jobs.map((job) => <Jobs job={job} key={job.jobId} />)}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                paginate={paginate}
              />
            </>
          ) : (
            <div className="text-center">
              <div className="background">
                <strong>
                  {t('admin.noJob')}
                </strong>
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
