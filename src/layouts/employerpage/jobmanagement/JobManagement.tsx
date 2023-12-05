import { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthProvide";
import { JobModel } from "../../../models/JobModel";
import { Pagination } from "../../utils/Pagination";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { JobCategoryModel } from "../../../models/JobCategoryModel";
import { useDropzone } from "react-dropzone";
import { ApplicantModel } from "../../../models/ApplicantModel";
import { FaStar } from "react-icons/fa";
import ReactQuill from "react-quill";
import { useTranslation } from 'react-i18next';
import { CSVLink, CSVDownload } from "react-csv"


export const JobManagement = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const logoFiveIT =
    "https://res.cloudinary.com/dzqoi9laq/image/upload/v1699419757/logoo_pyz2sp.png";
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState<JobModel[]>([]);
  const [job, setJob] = useState<JobModel | null>();
  const [applicants, setApplicants] = useState<ApplicantModel[]>([]);
  const [applicantView, setApplicantView] = useState<ApplicantModel>();
  // const [jobId, setJobId] = useState("27");
  const [status, setStatus] = useState("ENABLE");
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jobperPage] = useState(4);

  //form
  const [jobCate, setJobCate] = useState<JobCategoryModel[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("location");
  const [selectedCate, setSelectedCate] = useState("0");
  const [reEditorHtml, setReEditorHtml] = useState("");
  const [deEditorHtml, setDeEditorHtml] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageFileType, setImageFileType] = useState("");

  // Handle pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  //display form
  const [isDisplayedForm, setIsDisplayedForm] = useState(true);
  const [isUpdate, setIsUpdate] = useState(true);

  const token: any = localStorage.getItem("jwt_token");
  const now = new Date();
  now.setHours(now.getHours() + 7);
  const today = now.toISOString().split("T")[0];
  const [pdfURL, setPdfURL] = useState("");

  const [viewPDF, setViewPDF] = useState(false);
  const [viewApprovedModel, setViewApprovedModel] = useState(false);
  const [searchJobURL, setSearchJobURL] = useState("");

  const [messageToCandidate, setMessageToCandidate] = useState("");
  const [statusApplicant, setStatusApplicant] = useState("");

  const [jobDeadline, setJobDeadline] = useState<JobModel[]>([]);
  const [isDisplayedCloseJobModal, setIsDisplayedCloseJobModal] =
    useState(true);

  const [confirmCloseJob, setConfirmCloseJob] = useState(false);
  const [viewCoverletter, setViewCoverletter] = useState(false);

  const [applicantStatus, setApplicantStatus] = useState("WAITING");

  const [isDisplayApplicantAndComment, setIsDisplayApplicantAndComment] =
    useState(false);
  // page for applicant
  const [currentPageApply, setCurrentPageApply] = useState(1);
  const [totalPageApply, setTotalPageApply] = useState(0);
  const [jobsPerPageApply] = useState(5);
  const [totalJobsApply, setTotalJobsApply] = useState(0);
  // page for commentForJob
  const [currentPageCmt, setCurrentPageCmt] = useState(1);
  const [totalPageCmt, setTotalPageCmt] = useState(0);
  const [jobsPerPageCmt] = useState(2);
  const [totalJobsCmt, setTotalJobsCmt] = useState(0);

  const paginateApply = (pageNumber: number) => setCurrentPageApply(pageNumber);
  const paginateCmt = (pageNumber: number) => setCurrentPageCmt(pageNumber);

  const [currentTab, setCurrentTab] = useState("waiting");

  const [messageToCandidateError, setMessageToCandidateError] = useState<
    string | null
  >(null);

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
  //tabMuinpm

  const handleDisableButton = () => {
    setConfirmCloseJob(true);
  };

  const handleCancelButtonConfirm = () => {
    setConfirmCloseJob(false);
  };

  const openCV = (pdf: any, applicant: any) => {
    setViewPDF(true);
    setPdfURL(pdf);
    setApplicantView(applicant);
  };
  const closeCV = () => {
    setViewPDF(false);
    setViewCoverletter(false);
  };

  const handleCloseJobDeadline = () => {
    setIsDisplayedCloseJobModal(false);
    closeJobDeadline();
  };

  // ------------------------------------------------------------------------------------------------------------

  //Declare Form Data Form error interface Job
  //form data

  interface FormData {
    jobId: string;
    title: string;
    salary: any;
    category: string;
    location: string;
    file: File | null;
    description: string;
    requirements: string;
    applicationDeadline: string;
    quantityCv: any;
  }

  interface CommentForJob {
    reviewText: string;
    rating: any;
    createdAt: string;
  }
  const comments: CommentForJob[] = [];
  const [commentForJob, setCommentForJob] = useState<CommentForJob[]>([
    {
      reviewText: "",
      rating: 0,
      createdAt: "",
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    jobId: "",
    title: "",
    salary: 0,
    category: "",
    location: "",
    file: null,
    description: "",
    requirements: "",
    applicationDeadline: "",
    quantityCv: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData> | null>({});

  //  UseEffect

  useEffect(() => {
    fetchJobs();
    setApplicants([]);
    setCommentForJob([]);
    setIsDisplayApplicantAndComment(false);
  }, [status, currentPage, searchJobURL]);

  useEffect(() => {
    setIsDisplayedForm(false);
    const fetchData = async () => {
      const locationURL = "http://localhost:8080/provinces";
      const jobCateURL = "http://localhost:8080/api/jobCate";
      try {
        const [locationRes, cateRes] = await Promise.all([
          fetch(locationURL),
          fetch(jobCateURL),
        ]);

        if (!locationRes.ok || !cateRes.ok) {
          throw new Error("Something went wrong with one of the requests");
        }

        const [locationData, cateData] = await Promise.all([
          locationRes.json(),
          cateRes.json(),
        ]);
        setLocation(locationData.map((item: any) => item.provinceName));

        const loadedCate: JobCategoryModel[] = cateData.map((cate: any) => ({
          categoryId: cate.categoryId,
          categoryName: cate.categoryName,
        }));
        setJobCate(loadedCate);
      } catch (error: any) { }
    };
    fetchData();
  }, []);

  // fetch close job
  useEffect(() => {
    console.log("TODAY")
    const fetchData = async () => {
      const jobURL = `http://localhost:8080/auth/employer/getJobApplicationDeadline?applicationDeadline=${today}`;
      try {
        const response = await fetch(jobURL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.ok) {
          const jobData = await response.json();
          setJobDeadline(jobData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // other function------------------------------------------

  const closeJobDeadline = async () => {
    const jobURL = `http://localhost:8080/auth/employer/closeJobDeadline?applicationDeadline=${today}`;
    try {
      const response = await fetch(jobURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setStatusForJob = (status: string) => {
    setStatus(status);
    setCurrentPage(1);
    setSearchJobURL("");
    setIsDisplayedForm(false);
    setQuery("");
    setStartDate("");
    setEndDate("");
  };

  //Validate form
  function isNumeric(value: any) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  const validateForm = () => {
    let errors: Partial<FormData> = {};
    let isValid = true;

    if (formData.title.trim().length < 5) {
      errors.title = t('formErrors.invalidTitle');
      isValid = false;
    }
    if (
      !isNumeric(formData.salary) ||
      !formData.salary ||
      formData.salary <= 0
    ) {
      errors.salary = t('formErrors.invalidSalary');
      isValid = false;
    }

    if (formData.category === "0") {
      errors.category = t('formErrors.category');
      isValid = false;
    }
    if (formData.location === "location") {
      errors.location = t('formErrors.location');
      isValid = false;
    }
    if (!isNumeric(formData.quantityCv) || formData.quantityCv <= 0) {
      errors.quantityCv = t('formErrors.invalidQuantity');
      isValid = false;
    }

    if (deEditorHtml.trim().length < 30) {
      errors.description = t('formErrors.invalidDescription');
      isValid = false;
    }
    if (reEditorHtml.trim().length < 30) {
      errors.requirements = t('formErrors.invalidRequirements');
      isValid = false;
    }

    if (!formData.applicationDeadline) {
      errors.applicationDeadline = t('formErrors.closeDate');
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  //fetch jobs
  const fetchJobs = async () => {
    let jobsURL = "";
    if (searchJobURL === "") {
      jobsURL = `http://localhost:8080/auth/employer/getAllJob?email=${user?.name
        }&status=${status}&page=${currentPage - 1}&size=${jobperPage}`;
    } else {
      let searchWithPage = searchJobURL.replace(
        "<currentPage>",
        `${currentPage - 1}`
      );
      jobsURL = searchWithPage;
    }

    try {
      const response = await fetch(jobsURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Replace with your actual authorization token
        },
      });

      if (response.ok) {
        const data = await response.json();
        const jobData = data.content;
        const jobsList: JobModel[] = [];
        jobData.map((job: JobModel) => {
          jobsList.push({
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
            quantityCv: job.quantityCv,
            // Thêm các thuộc tính khác của JobModel tương ứng
          });
        });
        setJobs(jobsList);
        // setCurrentPage(1);
        setTotalPage(data.totalPages);
        setIsLoading(false);
      } else {
        throw new Error("Request failed");
      }
    } catch (error: any) {
      console.log(error);

    }

    window.scrollTo(0, 500);
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (jobNew: JobModel) => {
    setJob(jobNew);
    setFormData({
      jobId: jobNew.jobId.toString(),
      title: jobNew.title,
      salary: jobNew.salary,
      category: jobNew.jobCategory.categoryId.toString(),
      location: jobNew.location,
      file: null,
      description: "",
      requirements: "",
      applicationDeadline: adjustDateToTimeZone(jobNew.applicationDeadline),
      quantityCv: jobNew.quantityCv,
    });
    setFormErrors(null)
    setReEditorHtml(jobNew.requirements);
    setDeEditorHtml(jobNew.description);
    setImageURL(jobNew.jobImg);
    setIsDisplayedForm(true);
    setIsUpdate(true);
    console.log(formData);
  };

  const handleNewJob = async () => {
    setFormData({
      jobId: "",
      title: "",
      salary: 0,
      category: "0",
      location: "location",
      file: null,
      description: "",
      requirements: "",
      applicationDeadline: "",
      quantityCv: "",
    });
    setReEditorHtml("");
    setDeEditorHtml("");
    setJob(null);
    setFormErrors(null);
    setImageURL("");
    setIsUpdate(false);
  };


  const handleNewButton = async () => {
    setFormData({
      jobId: "",
      title: "",
      salary: 0,
      category: "0",
      location: "location",
      file: null,
      description: "",
      requirements: "",
      applicationDeadline: "",
      quantityCv: "",
    });
    setReEditorHtml("");
    setDeEditorHtml("");
    setJob(null);
    setFormErrors(null);
    setImageURL("");
    setIsUpdate(false);
    setIsDisplayedForm(true);
  };

  //View applicant function

  function extractAndDecodeFileName(fileUrl: any) {
    const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const decodedFileName = decodeURIComponent(fileName);
    return decodedFileName;
  }

  useEffect(() => {
    if (job) {
      handleViewApplicantButton(job);
      fetchReviewAndRating(job);
    }
  }, [currentPageApply, currentPageCmt]);
  const handleViewApplicantButton = async (jobNew: JobModel) => {
    setApplicantStatus("WAITING");
    setJob(jobNew);
    let baseApplicantURL = `http://localhost:8080/api/applicants/search/findApplicantByJobId?jobId=${jobNew.jobId
      }&page=${currentPageApply - 1}&size=${jobsPerPageApply}`;
    try {
      const responseApplicant = await fetch(baseApplicantURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (responseApplicant.ok) {
        if (responseApplicant.ok) {
          const data = await responseApplicant.json();
          setApplicants(data._embedded.applicants);
          setTotalJobsApply(data.page.totalElements);
          setTotalPageApply(data.page.totalPages);
        }
        setIsDisplayApplicantAndComment(true);
      }
    } catch { }
  };

  const fetchReviewAndRating = async (jobNew: JobModel) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviewAndRatings/search/findReviewAndRatingByJobId?jobId=${jobNew?.jobId
        }&page=${currentPageCmt - 1}&size=${jobsPerPageCmt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCommentForJob(data._embedded.reviewAndRatings);
        setTotalJobsCmt(data.page.totalElements);
        setTotalPageCmt(data.page.totalPages);
      }
    } catch (error) {
      console.log("Error fetching API:", error);
    }
  };

  //handleCLoseButton for Job
  const handleCloseJob = async () => {
    setIsLoading(true);
    const urlFetch = `http://localhost:8080/auth/employer/closeJob?jobId=${job?.jobId}`;
    try {
      const response = await fetch(urlFetch, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchJobs();
        setApplicants([]);
        setIsLoading(false);
        setConfirmCloseJob(false);
        setIsDisplayedForm(false)
        showToastMessage(t('showToastMessage.successCloseJob'));
      } else {
        showToastMessage(t('showToastMessage.errorCloseJob'));
      }
    } catch { }
  };

  //handle Denied applicant
  const deniedOrApproveddApplicant = async () => {
    if (messageToCandidate.trim().length > 0) {
      const urlFetch = `http://localhost:8080/auth/employer/approvedApplicant?applicantId=${applicantView?.applicantId}&message=${messageToCandidate}&status=${statusApplicant}`;
      try {
        const response = await fetch(urlFetch, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your actual authorization token
          },
        });

        if (response.ok) {
          const updatedApplicants = applicants.filter(
            (applicant) => applicant.applicantId !== applicantView?.applicantId
          );
          setApplicants(updatedApplicants);

          setIsLoading(false);
          setMessageToCandidateError(null);
          showToastMessage(t('showToastMessage.successSendMessage'));
          return true;
        } else {
          showToastMessage(t('showToastMessage.errorSendMessage'));
          return false;
        }
      } catch { }
    } else {
      setMessageToCandidateError(t('formErrors.sendMessage'));
      return false;
    }
  };

  useEffect(() => { }, [applicants]);

  // search
  const searchJob = async (
    status: string,
    startDate: string,
    endDate: string,
    query: string
  ) => {
    setStatus(status);
    setStartDate(startDate);
    setEndDate(endDate);
    setQuery(query);

    const searchURL = `http://localhost:8080/auth/employer/searchJob?status=${status}&startDate=${startDate}&endDate=${endDate}&query=${query}&page=<currentPage>&size=${jobperPage}`;
    setSearchJobURL(searchURL);
    setApplicants([]);
    setCommentForJob([]);
  };

  //sendMesage to Candidate
  const sendMessage = async () => {
    const result = await deniedOrApproveddApplicant();
    if (result) {
      setViewApprovedModel(false);
      setViewPDF(false);
    }
  };

  //format date
  function formatDate(isoDate: any) {
    const dateObject = new Date(isoDate);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    return `${day}/${month}/${year}`;
  }

  //Submit form for update job
  const handleSubmitFormUpdate = async (event: React.FormEvent) => {
    const isValid = validateForm();
    if (isUpdate) {
      event.preventDefault();
      const formDataPost = new FormData();
      if (isValid) {
        setIsLoading(true);
        if (formData.file) {
          formDataPost.append("file", formData.file);
        }
        formDataPost.append("jobId", formData.jobId);
        formDataPost.append("title", formData.title);
        formDataPost.append("cateId", formData.category);
        formDataPost.append("location", formData.location);
        formDataPost.append("salary", formData.salary);
        formDataPost.append("description", deEditorHtml);
        formDataPost.append("requirements", reEditorHtml);
        formDataPost.append(
          "applicationDeadline",
          formData.applicationDeadline
        );
        formDataPost.append("quantityCv", formData.quantityCv);
        console.log("UPDATEE", formDataPost);
        setTimeout(async () => {
          try {
            const response = await fetch(
              "http://localhost:8080/auth/employer/updateJob",
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${user?.token}`, // Add the token here
                },
                body: formDataPost,
              }
            );

            if (response.ok) {
              setIsLoading(false);
              showToastMessage(t('showToastMessage.successUpdateJob'));
              setFormData({
                jobId: "",
                title: "",
                salary: "",
                category: "",
                location: "",
                file: null,
                description: "",
                requirements: "",
                applicationDeadline: "",
                quantityCv: "",
              });
              setReEditorHtml("");
              setDeEditorHtml("");
              setCurrentPage(1);
              setImageURL("fiveIT");
              fetchJobs();
            } else {
              setIsLoading(false);
              showToastMessage(t('showToastMessage.errorUpdateJob'));
            }
          } catch (error) {
            // Handle network error
          } finally {
            setIsLoading(false);
          }
        }, 500);
      }
    }
    if (!isUpdate) {
      event.preventDefault();
      const formDataPost = new FormData();
      if (isValid) {
        setIsLoading(true);
        if (formData.file) {
          formDataPost.append("file", formData.file);
        } else {
          formDataPost.append("defaultImg", logoFiveIT);
        }
        formDataPost.append("title", formData.title);
        formDataPost.append("cateId", formData.category);
        formDataPost.append("location", formData.location);
        formDataPost.append("salary", formData.salary);
        formDataPost.append("description", deEditorHtml);
        formDataPost.append("requirements", reEditorHtml);
        formDataPost.append(
          "applicationDeadline",
          formData.applicationDeadline
        );
        formDataPost.append("quantityCv", formData.quantityCv);
        setTimeout(async () => {
          try {
            const response = await fetch(
              "http://localhost:8080/auth/employer/postJob",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${user?.token}`, // Add the token here
                },
                body: formDataPost,
              }
            );

            if (response.ok) {
              setIsLoading(false);
              showToastMessage(t('showToastMessage.successPostJob'));
              setFormData({
                jobId: "",
                title: "",
                salary: "",
                category: "",
                location: "",
                file: null,
                description: "",
                requirements: "",
                applicationDeadline: "",
                quantityCv: "",
              });
              setReEditorHtml("");
              setDeEditorHtml("");
              setSelectedCate("0");
              setImageURL("");
              setSelectedLocation("location");
            } else {
              setIsLoading(false);
              showToastMessage(t('showToastMessage.errorPostJob'));
            }
          } catch (error) {
            // Handle network error
          } finally {
            setIsLoading(false);
          }
        }, 500);
      }
    }
  };

  //upload
  //upload avt job
  const onImageDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setImageFile(selectedFile);
      setImageFileName(selectedFile.name);

      const reader = new FileReader();

      reader.onload = () => {
        setImageURL(reader.result as string);
        setFormData({ ...formData, file: selectedFile });
        // Move the handleImgUpload call here
        // handleImgUpload(selectedFile);
      };
      reader.readAsDataURL(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        setImageFileType(selectedFile.type);
      } else {
        showToastMessage(t('showToastMessage.invalidIMGFile'));
        setImageFile(null);
      }
    }
  };

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({ onDrop: onImageDrop });

  //format date
  function adjustDateToTimeZone(dateString: any) {
    const dateObject = new Date(dateString);

    const adjustedDate = new Date(dateObject.getTime() + 24 * 60 * 60 * 1000);

    const formattedDate = adjustedDate.toISOString().split("T")[0];

    return formattedDate;
  }

  // click Edit auto scroll Top
  const handleMoveOnTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  //cancel form
  const handleCancelForm = () => {
    setFormData({
      jobId: "",
      title: "",
      salary: "",
      category: "",
      location: "",
      file: null,
      description: "",
      requirements: "",
      applicationDeadline: "",
      quantityCv: "",
    });
    setFormErrors(null);
    setSelectedCate("0");
    setSelectedLocation("location");
    setReEditorHtml("");
    setDeEditorHtml("");
    setImageURL("");
    setIsDisplayedForm(false);
  };

  //format money
  function formatMoney(number: any) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // END END END  END END  END
  //end

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  //toast message
  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };
  //lkaoding
  if (isLoading) {
    return <SpinnerLoading />;
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="row justify-content-center mt-4">
          <h3 className="text-center fw-bold text-success">{t('jobManagement.jobManagement')}</h3>

        </div>
        {isDisplayedForm === false &&(
        <button className="btn btn-success" id="newButtonBegin" onClick={handleNewButton}>{t("btn.btnNew")}</button>
        )}
        <div className="content container-fluid">
          <div className="row">
            {/* show form */}
            <div
              className={`col-xl-12 col-sm-12 col-12 ${isDisplayedForm ? "" : "display-none"
                }`}
            >
              <form method="PUT" onSubmit={handleSubmitFormUpdate}>
                <div className="row">
                  <div className="col-xl-12 col-sm-12 col-12">
                    <div className="card">
                      <div className="card-header">
                        <div className="row">
                          <div className="col-9">
                            {isUpdate ?
                              <h5 className="card-titles text-success">
                                {t('jobManagement.updateJob')}
                              </h5> : <h5 className="card-titles text-success">
                                {t('jobManagement.postJob')}
                              </h5>
                            }
                          </div>
                        </div>

                        <div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <label htmlFor="" className="ms-4 fw-bold">
                            {t('jobManagement.chooseImg')}
                          </label>
                          <div className="col-md-3">
                            <div {...getImageRootProps()} className="">
                              {/*  */}
                              <input {...getImageInputProps()} />
                              {imageURL ? (
                                <img
                                  src={imageURL}
                                  className="img"
                                  alt="aaaa"
                                  style={{ height: "100px", width: "170px", objectFit: "contain" }}
                                />
                              ) : (
                                <img
                                  src={job?.jobImg}
                                  className="form-control"
                                  alt="Click here"
                                  style={{ height: "100px", width: "170px", objectFit: "contain" }}
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-md-9">
                            <label htmlFor="bio" className="form-label fw-bold">
                              {t('placeholders.title')}
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="title"
                              id="title"
                              placeholder={t('placeholders.title')}
                              value={formData?.title}
                              onChange={handleInputChange}
                            />
                            {formErrors?.title ? (
                              <label htmlFor="title">
                                {" "}
                                <span className="error-message text-danger">
                                  {formErrors.title}
                                </span>
                              </label>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="row">
                            <div className="col-xl-6">
                              <div className="form-group">
                                <label
                                  htmlFor="bio"
                                  className="form-label fw-bold"
                                >
                                  {t('placeholders.salary')}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="salary"
                                  placeholder={t('placeholders.salary')}
                                  value={formData.salary}
                                  onChange={handleInputChange}
                                />
                                {formErrors?.salary ? (
                                  <label htmlFor="title">
                                    {" "}
                                    <span className="error-message text-danger">
                                      {formErrors.salary}
                                    </span>
                                  </label>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="form-group">
                                <label
                                  htmlFor="bio"
                                  className="form-label fw-bold"
                                >
                                  {t('placeholders.quantityCV')}
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="quantityCv"
                                  placeholder={t('placeholders.quantityCV')}
                                  value={formData.quantityCv}
                                  onChange={handleInputChange}
                                />
                                {formErrors?.quantityCv ? (
                                  <label htmlFor="quantityCv">
                                    {" "}
                                    <span className="error-message text-danger">
                                      {formErrors?.quantityCv}
                                    </span>
                                  </label>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="">
                                <label
                                  htmlFor="bio"
                                  className="form-label fw-bold"
                                >
                                  {t('placeholders.closeDate')}
                                </label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="applicationDeadline"
                                  placeholder={t('placeholders.closeDate')}
                                  min={today}
                                  value={formData.applicationDeadline}
                                  onChange={handleInputChange}
                                />
                                {formErrors?.applicationDeadline ? (
                                  <label htmlFor="quantityCv">
                                    {" "}
                                    <span className="error-message text-danger">
                                      {formErrors?.applicationDeadline}
                                    </span>
                                  </label>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-6 col-sm-12 col-12">
                            <div className="form-group">
                              <label
                                htmlFor="bio"
                                className="form-label fw-bold"
                              >
                                {t('placeholders.category')}
                              </label>
                              <select
                                className="select form-control"
                                name="category"
                                value={formData.category}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    category: e.target.value,
                                  })
                                }
                              >
                                <option value="0">{t('placeholders.category')}</option>
                                {jobCate.map((cate) => (
                                  <option
                                    key={cate.categoryId}
                                    value={cate.categoryId}
                                  >
                                    {cate.categoryName}
                                  </option>
                                ))}
                              </select>
                              {formErrors?.category ? (
                                <label htmlFor="quantityCv">
                                  {" "}
                                  <span className="error-message text-danger">
                                    {formErrors?.category}
                                  </span>
                                </label>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="col-xl-6 col-sm-12 col-12">
                            <div className="form-group">
                              <label
                                htmlFor="bio"
                                className="form-label fw-bold"
                              >
                                {t('placeholders.location')}
                              </label>
                              <select
                                className="select form-control"
                                name="location"
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    location: e.target.value,
                                  })
                                }
                                value={formData.location}
                              >
                                <option value="location">{t('placeholders.location')}</option>
                                {location.map((loca, index) => (
                                  <option key={index} value={loca}>
                                    {loca}
                                  </option>
                                ))}
                              </select>
                              {formErrors?.location ? (
                                <label htmlFor="quantityCv">
                                  {" "}
                                  <span className="error-message text-danger">
                                    {formErrors.location}
                                  </span>
                                </label>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="row">
                            <div className="form-group">
                              <label
                                htmlFor="bio"
                                className="form-label fw-bold"
                              >
                                {t('placeholders.description')}
                              </label>
                              <ReactQuill
                                value={deEditorHtml}
                                onChange={setDeEditorHtml}
                              />
                              {formErrors?.description ? (
                                <label htmlFor="description">
                                  {" "}
                                  <span className="error-message text-danger">
                                    {formErrors.description}
                                  </span>
                                </label>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group">
                              <label
                                htmlFor="bio"
                                className="form-label fw-bold"
                              >
                                {t('placeholders.requirements')}
                              </label>
                              <ReactQuill
                                value={reEditorHtml}
                                onChange={setReEditorHtml}
                              />
                              {formErrors?.requirements ? (
                                <label htmlFor="requirements">
                                  {" "}
                                  <span className="error-message text-danger">
                                    {formErrors?.requirements}
                                  </span>
                                </label>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-12 col-sm-12 col-12">
                          <div className="form-btn mt-3">
                            {!job ? (
                              <button
                                type="submit"
                                className="btn btn-success w-auto"
                              >
                                {t('btn.btnPost')}
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="btn btn-success w-auto"
                                disabled={
                                  job?.status === "ENABLE" ||
                                  (job.approval === "APPROVED" &&
                                    job.status === "DISABLE")
                                }
                              >
                                {t('btn.btnUpdate')}
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-info w-auto ms-3"
                              onClick={handleNewJob}
                            >
                              {t('btn.btnNew')}
                            </button>
                            {job && job.status === "ENABLE" ? (
                              <button
                                type="button"
                                className="btn btn-warning w-auto ms-3"
                                onClick={handleDisableButton}
                              >
                                {t('btn.btnDisable')}
                              </button>
                            ) : (
                              ""
                            )}
                            <button
                              type="button"
                              className="btn btn-danger w-auto ms-3"
                              onClick={handleCancelForm}
                            >
                              {t('btn.btnCancel')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* req and des */}
                  <div className="col-xl-12 col-sm-12 col-12"></div>
                </div>
              </form>
            </div>
            {/*show applicant  */}
            <div className="col-xl-12 col-sm-12 col-12 mt-4 ">
              {isDisplayApplicantAndComment && (
                <>
                  <div className="container mt-4">
                    <div className="card">
                      <b className="card-header">
                        {t('jobManagement.appliedForJob')} ({totalJobsApply} applied)
                      </b>
                      {applicants.length <= 0 ? (
                        <p className="p-3">
                          {t('jobManagement.noCandidate')}
                        </p>
                      ) : (
                        <>
                          <div className="">
                            <ul
                              className="nav nav-tabs"
                              id="myTab"
                              role="tablist"
                            >
                              <li className="nav-item" role="presentation">
                                <a
                                  className="nav-link active fw-bold"
                                  id="waiting-tab"
                                  data-bs-toggle="tab"
                                  href="#statusJob"
                                  role="tab"
                                  aria-controls="waiting"
                                  aria-selected="true"
                                  onClick={() => setCurrentTab("waiting")}
                                >
                                  {t('status.waiting')}{" "}
                                  <span className="text-danger">
                                    ({waitingCount})
                                  </span>
                                </a>
                              </li>
                              <li className="nav-item" role="presentation">
                                <a
                                  className="nav-link fw-bold"
                                  id="approval-tab"
                                  data-bs-toggle="tab"
                                  href="#statusJob"
                                  role="tab"
                                  aria-controls="approval"
                                  aria-selected="false"
                                  onClick={() => setCurrentTab("approved")}
                                >
                                  {t('status.approved')}{" "}
                                  <span className="text-danger">
                                    ({approvedCount})
                                  </span>
                                </a>
                              </li>
                              <li className="nav-item" role="presentation">
                                <a
                                  className="nav-link fw-bold"
                                  id="closed-tab"
                                  data-bs-toggle="tab"
                                  href="#statusJob"
                                  role="tab"
                                  aria-controls="closed"
                                  aria-selected="false"
                                  onClick={() => setCurrentTab("closed")}
                                >
                                  {t('status.closed')}{" "}
                                  <span className="text-danger">
                                    ({closedCount})
                                  </span>
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
                                  style={{
                                    maxHeight: "60vh",
                                    overflowY: "auto",
                                  }}
                                >
                                  {filteredApplicants.length <= 0 ? (
                                    <p className="p-3">
                                      {t('jobManagement.noCandidate')}{" "}
                                      {currentTab}
                                    </p>
                                  ) : (
                                    <table className="table custom-table no-footer text-center">
                                      <thead>
                                        <tr>
                                          <th>{t('table.name')}</th>
                                          <th>{t('table.email')}</th>
                                          <th>{t('table.phone')}</th>
                                          <th>{t('table.CV')}</th>
                                          <th>{t('table.date')}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {filteredApplicants.map(
                                          (applicant, index) => (
                                            <tr key={index}>
                                              <td>{applicant.fullName}</td>
                                              <td>{applicant.email}</td>
                                              <td>{applicant.phoneNumber}</td>
                                              <td>
                                                {formatDate(
                                                  applicant.createdAt
                                                )}
                                              </td>
                                              <td className="text-center">
                                                <button
                                                  className="btn btn-success"
                                                  onClick={() =>
                                                    openCV(
                                                      applicant.cv,
                                                      applicant
                                                    )
                                                  }
                                                >
                                                  <i className="bi bi-eye-fill"></i>
                                                  {t('btn.btnView')}
                                                </button>
                                              </td>
                                            </tr>
                                          )
                                        )}
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
                      <b className="card-header">{t('jobManagement.commentForThisJob')}</b>
                      {commentForJob.length <= 0 ? (
                        <p className="p-3">{t('jobManagement.noComment')}</p>
                      ) : (
                        <div className="p-3">
                          <div id="comment">
                            <div id="comment">
                              {commentForJob.map((review, index) => (
                                <>
                                  <div>
                                    <div id="comment">
                                      <div className="d-flex">
                                        <div>
                                          <img
                                            src="assets/img/blog/comments-1.jpg"
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <b></b> <br />
                                          <time dateTime={review.createdAt}>
                                            {formatDate(review.createdAt)}
                                          </time>{" "}
                                          <br />
                                          {[...Array(5)].map(
                                            (star, starIndex) => {
                                              const currentRating =
                                                starIndex + 1;
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
                                                      currentRating <=
                                                        review.rating
                                                        ? "#ffc107"
                                                        : "#b0b0b0"
                                                    }
                                                  />
                                                </label>
                                              );
                                            }
                                          )}
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
            </div>
            <div className="col-xl-12 col-sm-12 col-12 mt-4">
              <div className="card card-lists ">
                <div className="row">
                  <div className="row mt-3 ms-2">
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t('searchForm.keyword')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            searchJob(status, startDate, endDate, query);
                          }
                        }}
                      ></input>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      ></input>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      ></input>
                    </div>
                    <div className="col-md-2">
                      <select
                        className="form-control bg-warning text-white"
                        value={status}
                        onChange={(e) => setStatusForJob(e.target.value)}
                      >
                        <option value="ENABLE">{t('status.enable')}</option>
                        <option value="DISABLE">{t('status.disable')}</option>
                      </select>
                    </div>
                    <div className="col-md-2 text-center">
                      <button
                        onClick={() =>
                          searchJob(status, startDate, endDate, query)
                        }

                        className="form-control btn-success me-4 bg-success text-white fw-bold"
                      >
                        {t('searchForm.searchBtn')}
                      </button>
                    </div>
                    {jobs.length > 0 && (
                      <div className="col-md-1">
                        <CSVLink
                          className="btn btn-success"
                          data={jobs}
                          filename="Job Management"
                          target="_blank"
                        >
                          Excel
                        </CSVLink>
                      </div>
                    )}
                  </div>
                  
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table  custom-table  no-footer">
                      <thead>
                        <tr>
                          <th>{t('table.img')}</th>
                          <th>{t('table.title')}</th>
                          <th>{t('table.salary')}</th>
                          <th>{t('table.closeDate')}</th>
                          <th>{t('table.category')}</th>
                          <th>{t('table.status')}</th>
                          <th>{t('table.approval')}</th>
                          <th>{t('table.applied')}</th>
                          <th className="text-center" colSpan={2}>
                            {t('table.action')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((jobItem, index) => (
                          <tr key={index}>
                            <td>
                              <img
                                src={jobItem.jobImg}
                                alt=""
                                style={{ width: "50px", height: "50px", objectFit: "contain" }}
                              />
                            </td>
                            <td>{jobItem.title}</td>
                            <td>{formatMoney(jobItem.salary)} đ</td>
                            <td>{formatDate(jobItem.applicationDeadline)}</td>
                            <td>{jobItem.jobCategory.categoryName}</td>
                            <td>{jobItem.status}</td>
                            <td>{jobItem.approval}</td>
                            <td className="text-center">
                              {jobItem.quantityCv}
                            </td>
                            <>
                              {status === "ENABLE" ? (
                                <td>
                                  <button
                                    className="btn btn-success"
                                    onClick={() => {
                                      handleEditClick(jobItem);
                                      handleMoveOnTop();
                                      setIsDisplayApplicantAndComment(false)

                                    }}
                                  >
                                    {t('btn.btnView')}
                                  </button>
                                </td>
                              ) : (
                                <td>
                                  <button
                                    className="btn btn-success"
                                    onClick={() => {
                                      handleEditClick(jobItem);
                                      handleMoveOnTop();
                                      setIsDisplayApplicantAndComment(false)
                                    }}
                                  >
                                    {t('btn.btnEdit')}
                                  </button>
                                </td>
                              )}

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-warning"
                                  onClick={() => {
                                    handleViewApplicantButton(jobItem);
                                    fetchReviewAndRating(jobItem);
                                    setIsDisplayedForm(false);
                                    handleMoveOnTop();

                                  }}
                                >
                                  <i className="bi bi-eye-fill"></i>
                                  CV
                                </button>
                              </td>
                            </>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPage >= 2 && (
                    <div className="mt-3 mb-2">
                      <Pagination
                        currentPage={currentPage}
                        totalPage={totalPage}
                        paginate={paginate}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* show ifrom */}

      {viewPDF && (
        <div id="modal" className="modal">
          <div className="modal-content w-100 h-100 text-center">
            <div className="row justify-content-end">
              {viewCoverletter ? (
                <div className="col-md-11">
                  <h5 className="ms-5 text-success fw-bold">{t('table.CL')}</h5>
                </div>
              ) : (
                ""
              )}
              <div className="col-md-1">
                <h4 className="btn text-danger" onClick={closeCV}>
                  X
                </h4>
              </div>
            </div>
            <hr />
            <div className="modal-body">
              {viewCoverletter ? (
                <iframe
                  title="Cover Letter"
                  width="100%"
                  height="100%"
                  srcDoc={applicantView?.coverletter || ""}
                ></iframe>
              ) : (
                <iframe src={pdfURL} width="100%" height="100%"></iframe>
              )}
            </div>
            {applicantView?.status === "WAITING" && job?.status === "ENABLE" ? (
              <div className="row">
                <div className="col-md-4">
                  <button
                    className="btn btn-danger text-light"
                    onClick={() => {
                      setViewApprovedModel(true);
                      setStatusApplicant("CLOSE");
                    }}
                  >
                    {t('btn.btnDenied')}
                  </button>
                </div>
                <div className="col-md-4">
                  {viewCoverletter ? (
                    <button
                      type="button"
                      className="btn btn-success text-light"
                      onClick={() => setViewCoverletter(false)}
                    >
                      CV
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success text-light"
                      onClick={() => setViewCoverletter(true)}
                    >
                      {t('table.CL')}
                    </button>
                  )}
                </div>
                <div className="col-md-4">
                  <button
                    type="button"
                    className="btn btn-success text-light"
                    onClick={() => {
                      setViewApprovedModel(true);
                      setStatusApplicant("APPROVED");
                    }}
                  >
                    {t('btn.btnApproved')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-12">
                  {viewCoverletter ? (
                    <button
                      type="button"
                      className="btn btn-success text-light"
                      onClick={() => setViewCoverletter(false)}
                    >
                      CV
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success text-light"
                      onClick={() => setViewCoverletter(true)}
                    >
                      {t('table.CL')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* model denied appreved */}
      {viewApprovedModel && (
        <div className="modal">
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="">{t('jobManagement.message')}</h6>
                <button
                  type="button"
                  className="btn-close text-danger"
                  onClick={() => setViewApprovedModel(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="rounded-3"
                  cols={100}
                  rows={4}
                  placeholder="Message"
                  onChange={(e) => setMessageToCandidate(e.target.value)}
                ></textarea>
                {messageToCandidateError !== null ? (
                  <label htmlFor="" className="text-danger">
                    {messageToCandidateError}
                  </label>
                ) : (
                  ""
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setViewApprovedModel(false)}
                >
                  {t('btn.btnClose')}
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={sendMessage}
                >
                  {t('btn.btnSend')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showToast === true && (
        <div
          className="position-fixed bottom-0 end-0 p-3 toast-message"
          style={{ zIndex: 5 }}
        >
          <div
            className={`toast ${showToast ? "show" : ""}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div
              className="toast-header"
              style={{ backgroundColor: "#198754", color: "white" }}
            >
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
          <>
            <div
              id="modal "
              className={`modal ${isDisplayedCloseJobModal && jobDeadline && jobDeadline.length > 0
                ? ""
                : "display-none"
                }`}
            >
              <div className="modal-content w-100 h-100">
                <div className="row justify-content-end">
                  <div className="col-md-11">
                    <h4 className="text-success">
                      {t('jobManagement.reachedDate')}
                    </h4>
                  </div>
                  <div className="col-md-1">
                    <h4
                      className="btn text-danger"
                      onClick={handleCloseJobDeadline}
                    >
                      X
                    </h4>
                  </div>
                </div>
                <div className="">
                  {jobDeadline !== null ? (
                    <table className="table custom-table  no-footer">
                      <thead>
                        <tr>
                          <th></th>
                          <th>{t('table.title')}</th>
                          <th>{t('table.salary')}</th>
                          <th>{t('table.closeDate')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobDeadline.map((jobItem: any, index: number) => (
                          <tr key={index}>
                            <td>
                              <img
                                src={jobItem.jobImg}
                                alt=""
                                style={{ width: "50px", height: "50px", objectFit: "contain" }}
                              />
                            </td>
                            <td>{jobItem.title}</td>
                            <td>{formatMoney(jobItem.salary)} đ</td>
                            <td>{formatDate(jobItem.applicationDeadline)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                </div>
                <div className="row"></div>
              </div>
            </div>
          </>
          {/* modal noti when close job */}
          {confirmCloseJob && job ? (
            <div className="modal">
              <div className="modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h6 className="">{t('jobManagement.confirmClose')}</h6>
                    <button
                      type="button"
                      className="btn-close text-danger"
                      onClick={handleCancelButtonConfirm}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <table className="table custom-table  no-footer">
                      <thead>
                        <tr>
                          <th></th>
                          <th>{t('table.title')}</th>
                          <th>{t('table.salary')}</th>
                          <th>{t('table.closeDate')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <img
                              src={job?.jobImg}
                              alt=""
                              style={{ width: "50px", height: "50px", objectFit: "contain" }}
                            />
                          </td>
                          <td>{job?.title}</td>
                          <td>{formatMoney(job?.salary)} đ</td>
                          <td>{formatDate(job?.applicationDeadline)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseJob}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleCancelButtonConfirm}
                    >
                      {t('btn.btnCancel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            " "
          )}

          {/*  */}
        </div >
      )}
      <style>
        {`
      

        .nav {
          position: sticky;
          top: 0;
          background-color: #c0c0c0	
          z-index: 1000; 
        }

        `}
      </style>
    </>
  );
};
