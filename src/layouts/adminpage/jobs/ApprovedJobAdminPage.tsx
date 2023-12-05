import { ChangeEvent, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { ApplicantModel } from "../../../models/ApplicantModel";
import { JobModel } from "../../../models/JobModel";
import { ReviewAndRatingModel } from "../../../models/ReviewAndRatingModel";
import { Page404 } from "../../errors/Page404";
import { Pagination } from "../../utils/Pagination";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { UserModel } from "../../../models/UserModel";
import { useTranslation } from "react-i18next";
import { BarChart } from "@mui/x-charts/BarChart";
import { CSVLink, CSVDownload } from "react-csv"
export const ApprovedJobAdminPage = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // page for job
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [jobsPerPage] = useState(5);
  const [totalJobs, setTotalJobs] = useState(0);

  // page for applicant
  const [currentPageApply, setCurrentPageApply] = useState(1);
  const [totalPageApply, setTotalPageApply] = useState(0);
  const [jobsPerPageApply] = useState(5);
  const [totalJobsApply, setTotalJobsApply] = useState(0);

  // page for comment and rating
  const [currentPageCmt, setCurrentPageCmt] = useState(1);
  const [totalPageCmt, setTotalPageCmt] = useState(0);
  const [jobsPerPageCmt] = useState(5);
  const [totalJobsCmt, setTotalJobsCmt] = useState(0);

  const [isInitialRender, setIsInitialRender] = useState(true);

  const [searchUrl, setSearchUrl] = useState("");
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("ENABLE");
  const [EditorHtml, setEditorHtml] = useState("");

  // const [blogs, setBlogs] = useState<BlogModel[]>([]);
  const [jobs, setJobs] = useState<JobModel[]>([]);
  const [applicants, setApplicants] = useState<ApplicantModel[]>([]);
  const [reviewAndRating, setReviewAndRating] = useState<
    ReviewAndRatingModel[]
  >([]);
  const approval: string = "APPROVED";
  const [editingJob, setEditingJob] = useState<JobModel | null>(null);
  const [totalApprovedJobByMonth, setTotalApprovedJobByMonth] = useState([0]);
  const [year, setYear] = useState("2023");
  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const token: any = localStorage.getItem("jwt_token");

  const fetchAllJobs = async () => {
    try {
      let baseUrlForJob = "";
      if (searchUrl === "") {
        baseUrlForJob = `http://localhost:8080/auth/admin/getAllJobs?jobTitle=${search}&approval=${approval}&status=${searchStatus}&startDate=${startDate}&endDate=${endDate}&page=${currentPage - 1
          }&size=${jobsPerPage}`;
      } else {
        let searchWithPage = searchUrl.replace(
          "<currentPage>",
          `${currentPage - 1}`
        );
        baseUrlForJob = searchWithPage;
      }

      const response = await fetch(baseUrlForJob, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const loadedJobs: JobModel[] = [];
        data.content.forEach((jobsData: any) => {
          const job = new JobModel(
            jobsData.jobId,
            jobsData.title,
            jobsData.jobCategory,
            jobsData.user,
            jobsData.jobImg,
            jobsData.description,
            jobsData.requirements,
            jobsData.location,
            jobsData.salary,
            jobsData.status,
            jobsData.applicationDeadline,
            jobsData.createdAt,
            jobsData.createdBy,
            jobsData.approval,
            jobsData.quantityCv
          );

          loadedJobs.push(job);
        });
        setJobs(loadedJobs);
        if (updated) {
          setCurrentPage(1);
          setUpdated(false);
        }
        setTotalJobs(data.totalElements);
        setTotalPage(data.totalPages);
        setIsLoading(false);
      } else {
        throw new Error("Request failed");
      }
    } catch (error: any) {
      setHttpError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, [currentPage, searchUrl, updated]);

  const searchHandleChange = (
    searchKey: string,
    searchStartDate: string,
    searchEndDate: string,
    searchStatus: string
  ) => {
    setCurrentPage(1);
    setEdit(false);
    setEditingJob(null);
    setView(false);

    let newURL = `http://localhost:8080/auth/admin/getAllJobs?jobTitle=${search}&approval=${approval}&status=${searchStatus}&startDate=${startDate}&endDate=${endDate}&page=<currentPage>&size=${jobsPerPage}`;
    setSearchUrl(newURL);
  };

  const handleEditJob = (Job: any) => {
    setEditingJob(Job);
    setEdit(true);
    setView(false);
    // setEditorHtml(Job.blogContent);
    setEditorHtml("");
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smooth scrolling
    });
  };

  const fetchApply = async (jobId: any) => {
    try {
      const response = await fetch(
        `http://localhost:8080/auth/admin/getAllApplicantByJob?jobId=${jobId}&page=${currentPageApply - 1
        }&size=${jobsPerPageApply}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const loadedApply: ApplicantModel[] = [];
        data.content.forEach((applysData: any) => {
          const applicant = new ApplicantModel(
            applysData.appicantId,
            applysData.job,
            applysData.user,
            applysData.fullName,
            applysData.email,
            applysData.phoneNumber,
            applysData.cv,
            applysData.coverletter,
            applysData.status,
            applysData.createdAt,
            applysData.message
          );

          loadedApply.push(applicant);
        });
        setApplicants(loadedApply);
        setTotalJobsApply(data.totalElements);
        setTotalPageApply(data.totalPages);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.log("Error fetching API:", error);
    }
  };

  const fetchReviewAndRating = async (jobId: any) => {
    try {
      const response = await fetch(
        `http://localhost:8080/auth/admin/getAllReviewAndRatingByJob?jobId=${jobId}&page=${currentPageCmt - 1
        }&size=${jobsPerPageCmt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const loadedRv: ReviewAndRatingModel[] = [];
        data.content.forEach((rvAndRatingsData: any) => {
          const userForRv: UserModel = {
            userId: rvAndRatingsData.userId,
            userName: rvAndRatingsData.userName,
            phoneNumber: rvAndRatingsData.phoneNumber,
            email: rvAndRatingsData.userName,
            status: rvAndRatingsData.status,
          };

          const rvAndRating = new ReviewAndRatingModel(
            rvAndRatingsData.reviewId,
            rvAndRatingsData.job,
            userForRv,
            rvAndRatingsData.rating,
            rvAndRatingsData.review_text,
            rvAndRatingsData.createdAt
          );

          loadedRv.push(rvAndRating);
        });
        setReviewAndRating(loadedRv);
        setTotalJobsCmt(data.totalElements);
        setTotalPageCmt(data.totalPages);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.log("Error fetching API:", error);
    }
  };

  const handleViewJob = (Job: any) => {
    setEditingJob(Job);
    setView(true);
    setEdit(false);
    fetchApply(Job.jobId);
    fetchReviewAndRating(Job.jobId);
    // setEditorHtml(Job.blogContent);
    setEditorHtml("");
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smooth scrolling
    });
  };

  useEffect(() => {
    if (editingJob) {
      fetchApply(editingJob.jobId);
    }
  }, [currentPageApply, searchUrl, updated]);

  useEffect(() => {
    if (editingJob) {
      fetchReviewAndRating(editingJob.jobId);
    }
  }, [currentPageCmt, searchUrl, updated]);

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.value;

    if (editingJob) {
      setEditingJob({
        ...editingJob,
        status: newStatus,
      });
    }
  };

  const handleCancel = () => {
    setEditingJob(null);
    setEdit(false);
    setView(false);
    setEditorHtml("");
  };

  const updateJobStatus = async () => {
    if (editingJob) {
      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8080/auth/admin/updateJobStatus?jobId=${editingJob.jobId.toString()}&status=${editingJob.status
          }`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setUpdated(true);
          setIsLoading(false);
          showToastMessage(t("showToastMessage.updateSuccess"));
          handleCancel();
        } else {
          showToastMessage(t("showToastMessage.updateFailed"));
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  useEffect(() => {
    const fetchTotalCandidateByMonth = async () => {
      try {
        const baseUrl = `http://localhost:8080/auth/admin/getTotalApprovedJobByMonth?year=${year}`;
        const response = await fetch(baseUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your actual authorization token
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTotalApprovedJobByMonth(data.approvedJobMap);
        } else {
          console.error("Failed to fetch");
        }
      } catch (error: any) {
        setHttpError(error.message);
      }
    };
    fetchTotalCandidateByMonth();
  }, [year]);

  const jobData: { month: number; value: number }[] = [];
  for (const key in totalApprovedJobByMonth) {
    if (totalApprovedJobByMonth.hasOwnProperty(key)) {
      const item = {
        month: parseInt(key),
        value: totalApprovedJobByMonth[key],
      };
      jobData.push(item);
    }
  }
  const xLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const paginateApply = (pageNumber: number) => setCurrentPageApply(pageNumber);
  const paginateCmt = (pageNumber: number) => setCurrentPageCmt(pageNumber);

  const [currentTab, setCurrentTab] = useState("waiting");

  const filteredApplicants = applicants.filter((applyItem) => {
    if (currentTab === "waiting") {
      return applyItem.status === "WAITING";
    } else if (currentTab === "approved") {
      return applyItem.status === "APPROVED";
    } else if (currentTab === "closed") {
      return applyItem.status === "CLOSE";
    }
    return true;
  });

  const waitingApplicants = applicants.filter(
    (applyItem) => applyItem.status === "WAITING"
  );
  const approvedApplicants = applicants.filter(
    (applyItem) => applyItem.status === "APPROVED"
  );
  const closedApplicants = applicants.filter(
    (applyItem) => applyItem.status === "CLOSE"
  );

  const waitingCount = waitingApplicants.length;
  const approvedCount = approvedApplicants.length;
  const closedCount = closedApplicants.length;
  // const numbetOfWaiting = filteredApplicants(applicants).length;

  function extractAndDecodeFileName(fileUrl: any) {
    const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const decodedFileName = decodeURIComponent(fileName);
    return decodedFileName;
  }

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
    return `${year}-${month}-${day} (${hours}:${minutes})`;
  }

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <Page404 error={httpError} />;
  }
  return (
    <>
      {edit && editingJob && (
        <>
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center mb-4">
                      <label htmlFor="fileInput" className="file-input-label">
                        <div
                          className="image-container"
                          style={{ position: "relative" }}
                        >
                          <img
                            src={
                              editingJob.jobImg ||
                              "https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg"
                            }
                            alt="Candidate"
                            className="img-fluid rounded-circle"
                            style={{
                              width: "10em",
                              objectFit: "fill",
                              height: "150px",
                            }}
                          />
                        </div>
                      </label>
                    </div>

                    <form>
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                              {t("placeholders.title")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="title"
                              placeholder={t("placeholders.title")}
                              readOnly
                              value={editingJob.title || "Title is null"}
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="category" className="form-label">
                              {t("placeholders.category")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="category"
                              placeholder="Category"
                              readOnly
                              value={
                                editingJob.jobCategory.categoryName ||
                                "Category is null"
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="createdBy" className="form-label">
                              {t("placeholders.createdBy")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("placeholders.createdBy")}
                              id="createdBy"
                              readOnly
                              value={editingJob.userId || "Created By is null"}
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="salary" className="form-label">
                              {t("placeholders.salary")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="salary"
                              placeholder={t("placeholders.salary")}
                              readOnly
                              value={editingJob.salary || "Salary is null"}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="location" className="form-label">
                              {t("placeholders.location")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="location"
                              placeholder={t("placeholders.location")}
                              value={editingJob.location || "Location is null"}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="createdAt" className="form-label">
                              {t("placeholders.createdAt")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="createdAt"
                              placeholder={t("placeholders.createdAt")}
                              value={
                                formatDateTime(editingJob.createdAt) ||
                                "Created At is null"
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="description" className="z-label">
                              {t("placeholders.description")}
                            </label>
                            <textarea
                              className="form-control"
                              id="description"
                              rows={4}
                              value={
                                editingJob.description ||
                                "Description bio is null"
                              }
                              readOnly
                            ></textarea>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="mb-3">
                            <label
                              htmlFor="requirements"
                              className="form-label"
                            >
                              {t("placeholders.requirements")}
                            </label>
                            <textarea
                              className="form-control"
                              id="requirements"
                              rows={4}
                              value={
                                editingJob.requirements ||
                                "Requirements bio is null"
                              }
                              readOnly
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="quantity" className="form-label">
                              {t("placeholders.quantityCV")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="quantity"
                              placeholder="Quantity"
                              value={
                                editingJob.quantityCv || "Quantity is null"
                              }
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="mb-3">
                            <label className="form-label">
                              {t("status.status")}
                            </label>
                            <div className="row ms-3  align-items-center d-flex justify-content-center">
                              <div className="form-check">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  id="enable"
                                  value="ENABLE"
                                  checked={editingJob.status === "ENABLE"}
                                  onChange={handleStatusChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="enable"
                                >
                                  {t("status.enable")}
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  id="disable"
                                  value="DISABLE"
                                  checked={editingJob.status === "DISABLE"}
                                  onChange={handleStatusChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="disable"
                                >
                                  {t("status.disable")}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-center">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={updateJobStatus}
                        >
                          {t("btn.btnUpdate")}
                        </button>
                        <button
                          type="submit"
                          className="btn btn-danger ms-3"
                          onClick={handleCancel}
                        >
                          {t("btn.btnCancel")}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {view && (
        <>
          <div className="container mt-4">
            <div className="card">
              <b className="card-header fw-bold text-success">
                {t("jobManagement.appliedForJob")} ({totalJobsApply} applied)
              </b>
              {applicants.length <= 0 ? (
                <p className="p-3 fw-bold text-success"> {t("jobManagement.noCandidate")}</p>
              ) : (
                <>
                  <div className="">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link active fw-bold text-success"
                          id="waiting-tab"
                          data-bs-toggle="tab"
                          href="#statusJob"
                          role="tab"
                          aria-controls="waiting"
                          aria-selected="true"
                          onClick={() => setCurrentTab("waiting")}
                        >
                          {t("status.waiting")}{" "}
                          <span className="text-danger">({waitingCount})</span>
                        </a>
                      </li>
                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link fw-bold text-success"
                          id="approval-tab"
                          data-bs-toggle="tab"
                          href="#statusJob"
                          role="tab"
                          aria-controls="approval"
                          aria-selected="false"
                          onClick={() => setCurrentTab("approved")}
                        >
                          {t("status.approved")}{" "}
                          <span className="text-danger">({approvedCount})</span>
                        </a>
                      </li>
                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link fw-bold text-success"
                          id="closed-tab"
                          data-bs-toggle="tab"
                          href="#statusJob"
                          role="tab"
                          aria-controls="closed"
                          aria-selected="false"
                          onClick={() => setCurrentTab("closed")}
                        >
                          {t("status.closed")}{" "}
                          <span className="text-danger">({closedCount})</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="">
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="statusJob"
                        role="tabpanel"
                        aria-labelledby="statusJob-tab"
                      >
                        <div
                          className="table-responsive"
                          style={{ maxHeight: "60vh", overflowY: "auto" }}
                        >
                          {filteredApplicants.length <= 0 ? (
                            <p className="p-3 fw-bold text-success">
                              {t("jobManagement.noCandidate")} {currentTab}
                            </p>
                          ) : (
                            <table className="table custom-table no-footer text-center">
                              <thead>
                                <tr>
                                  <th>{t("table.name")}</th>
                                  <th>{t("table.email")}</th>
                                  <th>{t("table.phone")}</th>
                                  <th>{t("table.CV")}</th>
                                  <th>{t("table.date")}</th>
                                  <th>{t("table.status")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredApplicants.map((applicant, index) => (
                                  <tr key={index}>
                                    <td>{applicant.fullName}</td>
                                    <td>{applicant.email}</td>
                                    <td>{applicant.phoneNumber}</td>
                                    <td>
                                      {extractAndDecodeFileName(applicant.cv)}
                                    </td>
                                    <td>
                                      {formatDateTime(applicant.createdAt)}
                                    </td>
                                    <td className="text-center">
                                      {applicant.status}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}

                          {totalPageApply >= 2 && (
                            <Pagination
                              currentPage={currentPageApply}
                              totalPage={totalPageApply}
                              paginate={paginateApply}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Comments cho công việc */}
            <div className="card mt-4">
              <b className="card-header fw-bold text-success">
                {t("jobManagement.commentForThisJob")} ({totalJobsCmt} comments)
              </b>
              {reviewAndRating.length <= 0 ? (
                <p className="p-3 fw-bold text-success">{t("jobManagement.noComment")}</p>
              ) : (
                <div className="p-3">
                  <div id="comment">
                    <div id="comment">
                      {reviewAndRating.map((review, index) => (
                        <>
                          <div key={index}>
                            <div id="comment">
                              <div className="d-flex">
                                <div>
                                  <img
                                    src="assets/img/blog/comments-1.jpg"
                                    alt=""
                                  />
                                </div>
                                <div>
                                  <b>{review.user.email}</b> <br />
                                  <time dateTime={review.createdAt}>
                                    {formatDateTime(review.createdAt)}
                                  </time>{" "}
                                  <br />
                                  {[...Array(5)].map((star, starIndex) => {
                                    const currentRating = starIndex + 1;
                                    return (
                                      <label key={starIndex}>
                                        <input
                                          type="radio"
                                          name="rating"
                                          value={review.rating}
                                          style={{
                                            display: "none",
                                            cursor: "pointer",
                                          }}
                                        />
                                        <FaStar
                                          size={15}
                                          color={
                                            currentRating <= review.rating
                                              ? "#ffc107"
                                              : "#b0b0b0"
                                          }
                                        />
                                      </label>
                                    );
                                  })}
                                  <p
                                    key={`reviewText_${index}`}
                                    dangerouslySetInnerHTML={{
                                      __html: review.reviewText,
                                    }}
                                  ></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {totalPageCmt >= 2 && (
                <Pagination
                  currentPage={currentPageCmt}
                  totalPage={totalPageCmt}
                  paginate={paginateCmt}
                />
              )}
            </div>
          </div>
        </>
      )}

      {!edit && !editingJob && !view && (
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-9">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="mb-0">{t("dashboard.statisticsApprovedJob")}</h6>
                <div className="col-3">
                  <select
                    className="form-control"
                    id="selectMonth"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
              </div>
              <div className="card">
                <BarChart
                  xAxis={[
                    {
                      id: "barCategories",
                      data: xLabels,
                      scaleType: "band",
                    },
                  ]}
                  series={[
                    {
                      data: jobData.map((item) => item.value),
                      label: t("dashboard.approvedJob"),
                      color: "#198754"
                    },
                  ]}
                  height={450}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-12">
            <div className="bg-light rounded h-100 p-4">
              {/* Search form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  searchHandleChange(search, startDate, endDate, searchStatus);
                }}
              >
                <div className="form-row">
                  <div className="row">
                    <div className="col-md-4 col-lg-3 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="keyword"
                        placeholder={t("searchForm.keyword")}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 col-lg-2 mb-3">
                      <input
                        type="date"
                        className="form-control"
                        id="keyword"
                        placeholder="Keyword"
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 col-lg-2 mb-3">
                      <input
                        type="date"
                        className="form-control"
                        id="keyword"
                        placeholder="Keyword"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 col-lg-2 mb-3">
                      <select
                        className="form-select"
                        id="status"
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                      >
                        {/* <option value="">All status</option> */}
                        <option value="ENABLE">{t("status.enable")}</option>
                        <option value="DISABLE">{t("status.disable")}</option>
                      </select>
                    </div>

                    <div className="col-md-2 col-lg-2 mb-3 text-center">
                      <button
                        className="btn btn-success btn-block"
                        type="button"
                        onClick={() =>
                          searchHandleChange(
                            search,
                            startDate,
                            endDate,
                            searchStatus
                          )
                        }
                      >
                        {t("searchForm.searchBtn")}
                      </button>
                    </div>
                    {jobs.length > 0 && (
                      <div className="col-md-2 col-lg-1 mb-3">
                        <CSVLink
                          className="btn btn-success"
                          data={jobs}
                          filename="Approved Job"
                          target="_blank"
                        >
                          Excel
                        </CSVLink>
                      </div>
                    )}

                  </div>
                </div>
              </form>
              <>
                {jobs.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="text-center">
                        <tr>
                          <th scope="col">#</th>
                          <th>{t("table.title")}</th>
                          <th>{t("table.category")}</th>
                          <th>{t("table.img")}</th>
                          <th>{t("table.createdBy")}</th>
                          <th>{t("table.salary")}</th>
                          <th>{t("table.status")}</th>
                          <th>{t("table.action")}</th>
                          <th>{t("table.applicantRating")}</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {jobs.map((job, index) => (
                          <tr
                            key={job.jobId}
                            style={{ verticalAlign: "middle" }}
                          >
                            <th scope="row">{index + 1}</th>
                            <td>{job.title}</td>
                            <td>{job.jobCategory.categoryName}</td>
                            <td>
                              {job.jobImg && (
                                <img
                                  src={job.jobImg}
                                  alt={`Profile image of ${job.title}`}
                                  className="text-start"
                                  style={{
                                    maxWidth: "80px",
                                    maxHeight: "100px",
                                  }}
                                />
                              )}
                            </td>
                            <td>{job.createdBy}</td>
                            <td>{job.salary}</td>
                            <td>{job.status}</td>
                            <td style={{ minWidth: '100px' }}>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handleEditJob(job)}
                              >
                                <i className="fa fa-pencil-alt"></i>{" "}
                                {t("btn.btnEdit")}
                              </button>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => handleViewJob(job)}
                              >
                                <i className="fa fa-eye"></i> {t("btn.btnView")}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {totalPage >= 2 && (
                      <div className="mt-4 mb-0">
                        <Pagination
                          currentPage={currentPage}
                          totalPage={totalPage}
                          paginate={paginate}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="background">{t("admin.noJob")}</div>
                    <div>
                      <img
                        src="/assets/img/sorry.png"
                        className="img-fluid w-50"
                      />
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>

      {showToast === true && (

        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
          <div
            className={`toast ${showToast ? "show" : ""}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header bg-success text-white">
              <strong className="me-auto">{t("showToastMessage.status")}</strong>
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
      )}

      <style>
        {
          `
          .form-check-input:checked{
            background-color: #198754;
          }
          `
        }

      </style>
    </>
  );
};
