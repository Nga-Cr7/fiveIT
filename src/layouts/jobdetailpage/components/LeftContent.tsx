import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { JobModel } from "../../../models/JobModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Pagination } from "../../utils/Pagination";
import styles from "../../blogdetailpage/css/blog.module.css";
import { UserModel } from "../../../models/UserModel";
import { ReviewAndRatingModel } from "../../../models/ReviewAndRatingModel";
import { JobCategoryModel } from "../../../models/JobCategoryModel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvide";
import { TextEditorReactQuill } from "../../utils/TextEditorReactQuill";
import { ProfileModel } from "../../../models/ProfileModel";
import { useDropzone } from "react-dropzone";
import { useTranslation } from 'react-i18next';

export const LeftContent: React.FC<{ job?: JobModel }> = (props) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [avgRating, setAvgRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);
  const [postCmt, setPostCmt] = useState(false);
  const jobId = props.job?.jobId;

  const [rating, setRating] = useState(0);
  const [editorHtmlCmt, setEditorHtmlCmt] = useState('');
  const [editorHtmlApply, setEditorHtmlCmtApply] = useState('');
  const [formDataCmt, setFormDataCmt] = useState({ review_text: '' });

  // Handle pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(4);
  const [totalAmountOfRv, setTotalAmountOfRv] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [reviewAndRating, setReviewAndRating] = useState<ReviewAndRatingModel[]>([]);
  // Load profile in applyForm
  const [profile, setProfile] = useState<ProfileModel>();
  const [havingProfile, setHavingProfile] = useState(false);


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [applyNow, setApplyNow] = useState(queryParams.get('applyNow') === 'open');
  const openModal = () => {
    if (user === null) {
      showToastMessage("Please login");
      return
    }
    setApplyNow(true);
  };
  const closeModal = () => setApplyNow(false);



  useEffect(() => {
    const fetchReviewAndRating = async () => {
      const baseUrlForRv = `http://localhost:8080/api/reviewAndRatings/search/findReviewAndRatingByJobId?jobId=${jobId}&page=${currentPage - 1
        }&size=${jobsPerPage}`;

      const totalRvUrl = `http://localhost:8080/api/reviewAndRatings/search/findReviewAndRatingByJobId?jobId=${jobId}`;

      try {
        const [RvResponse, totalRvRespone] = await Promise.all([
          fetch(baseUrlForRv),
          fetch(totalRvUrl),
        ]);

        if (!RvResponse.ok || !totalRvRespone.ok) {
          throw new Error("Something went wrong with one of the requests");
        }

        const [reviewAndRatingData, reviewAndRatingTotalData] = await Promise.all([
          RvResponse.json(),
          totalRvRespone.json(),
        ]);

        const reviewAndRatinTotalgDataResponse =
          reviewAndRatingTotalData._embedded.reviewAndRatings;
        let count = 0;
        for (const key in reviewAndRatinTotalgDataResponse) {
          count = count + reviewAndRatinTotalgDataResponse[key].rating;
        }
        setTotalRating(count);



        const reviewAndRatingDataResponse =
          reviewAndRatingData._embedded.reviewAndRatings;


        setTotalAmountOfRv(reviewAndRatingData.page.totalElements);
        setTotalPage(reviewAndRatingData.page.totalPages);

        const loadedReviewAndRatingModels: ReviewAndRatingModel[] = [];

        for (const key in reviewAndRatingDataResponse) {
          const userInRvResponse = await fetch(
            reviewAndRatingDataResponse[key]._links.user.href
          );

          const jobInRvResponse = await fetch(
            reviewAndRatingDataResponse[key]._links.job.href
          );


          const userInRvDataResponse = await userInRvResponse.json();
          const jobInRvDataResponse = await jobInRvResponse.json();

          const userForRv: UserModel = {
            userId: userInRvDataResponse.userId,
            userName: userInRvDataResponse.userName,
            phoneNumber: userInRvDataResponse.phoneNumber,
            email: userInRvDataResponse.email,
            status: userInRvDataResponse.status,
          };

          const jobForRvCate = await fetch(
            reviewAndRatingDataResponse[key]._links.job.href
          );

          if (!jobForRvCate.ok) {
            throw new Error("Something went wrong with one of the requests");
          }

          const jobForRvCateResponse = await jobForRvCate.json();
          const dataRvCate = await fetch(
            jobForRvCateResponse._links.jobCategory.href
          );

          if (!dataRvCate.ok) {
            throw new Error("Something went wrong with one of the requests");
          }

          const dataRvCateResponse = await dataRvCate.json();



          const jobForRvCateData: JobCategoryModel = {
            categoryId: dataRvCateResponse.categoryId,
            categoryName: dataRvCateResponse.categoryName,
            categoryImg: dataRvCateResponse.categpryImg,
            createdAt: dataRvCateResponse.createdAt
          }


          const jobForRvUser = await fetch(
            reviewAndRatingDataResponse[key]._links.user.href
          );
          if (!jobForRvUser.ok) {
            throw new Error("Something went wrong with one of the requests");
          }
          const jobForRvUserResponse = await jobForRvUser.json();

          const jobCreatorId = jobForRvUserResponse.userId;



          const jobForRv: JobModel = {
            jobId: jobInRvDataResponse.jobId,
            title: jobInRvDataResponse.title,
            jobCategory: jobForRvCateData,
            userId: jobCreatorId,
            jobImg: jobInRvDataResponse.jobImg,
            description: jobInRvDataResponse.description,
            requirements: jobInRvDataResponse.requirements,
            location: jobInRvDataResponse.location,
            salary: jobInRvDataResponse.salary,
            status: jobInRvDataResponse.status,
            applicationDeadline: jobInRvDataResponse.applicationDeadline,
            createdAt: jobInRvDataResponse.createdAt,
            createdBy: jobInRvDataResponse.createdBy,
            approval: jobInRvDataResponse.approval,
            quantityCv: jobInRvDataResponse.quantityCv,
          };


          const reviewAndRating = new ReviewAndRatingModel(
            reviewAndRatingDataResponse[key].reviewId,
            jobForRv,
            userForRv,
            reviewAndRatingDataResponse[key].rating,
            reviewAndRatingDataResponse[key].reviewText,
            reviewAndRatingDataResponse[key].createdAt
          );
          loadedReviewAndRatingModels.push(reviewAndRating);

        }
        setReviewAndRating(loadedReviewAndRatingModels);
        if (postCmt) {
          setCurrentPage(1);
          setPostCmt(false);
        }
        setAvgRating(Math.round(totalRating / totalAmountOfRv));


        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setHttpError(error.message);
      }
    };

    fetchReviewAndRating();

  }, [currentPage, totalRating, postCmt]);

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    if (message === "Please Login to post your comment") {
      const toastMessage = document.querySelector('.toast-message');
      if (toastMessage) {
        toastMessage.addEventListener('click', () => {
          navigate('/login'); // Replace '/home' with the actual URL of your home page
        });
      }
    }
    setTimeout(() => setShowToast(false), 3000);
  };

  const token: any = localStorage.getItem("jwt_token");

  const handleSubmitCmt = async (e: React.FormEvent) => {
    e.preventDefault();
    formDataCmt.review_text = editorHtmlCmt;
    if (user === null) {
      showToastMessage(t("showToastMessage.pleaseLogin"));
      return;
    }
    if (formDataCmt.review_text.trim().length === 0) {
      showToastMessage(t("showToastMessage.reviewContent"));
      return;
    }

    if (rating === 0) {
      showToastMessage(t("showToastMessage.reviewRating"));
      return;
    }

    if (!(formDataCmt.review_text.trim().length === 0) && rating !== 0) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8080/auth/postComment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobId: jobId,
            rating: rating,
            review_text: formDataCmt.review_text,
          }),
        });

        if (response.ok) {
          setIsLoading(false);
          setPostCmt(true);
          setFormDataCmt({ review_text: "" });
          setEditorHtmlCmt("");
          setRating(0);
          window.scrollTo({
            top: 800,
            behavior: 'smooth'
          });
          showToastMessage(t("showToastMessage.successCommentMessage"));

        } else {
          setIsLoading(false);
          showToastMessage(t("showToastMessage.errorCommentMessage"));
        }
      } catch (error: any) {
        console.log("Error fetching API:", error);
        setIsLoading(false);
      }
    }

  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
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
          const btnDisabled = list.some((item: { jobId: number }) => item.jobId === props.job?.jobId);
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

  interface FormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    cv: File | null | string;
    coverletter: string;
  }



  const [formDataApply, setFormDataApply] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    cv: null,
    coverletter: "",
  });


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
          // console.log(profileData);
          const profileModel = new ProfileModel(
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
          setProfile(profileModel);
          setHavingProfile(true);
          setFormDataApply({
            fullName: profileModel?.userName, // Access name from profileModel
            email: profileModel?.email,
            phoneNumber: profileModel?.phoneNumber || "",
            cv: null || null || profileModel?.userCV || "",
            coverletter: "",
          });

          setPdfURL(profileModel?.userCV || "");

        }
      } catch (error) {
        console.log("Error fetching API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!(user === null)) {
      fetchProfile();
    }
  }, [user, havingProfile]);


  useEffect(() => {
    try {
      // Extracting the file name from the URL
      if (profile?.userCV && profile?.userCV.length > 0) {
        const fileName = profile.userCV.substring(profile.userCV.lastIndexOf('/') + 1);
        const decodedFileName = decodeURIComponent(fileName);
        setPdfFileName(decodedFileName);
      }
      // Decoding the URL-encoded file name
    } catch (error) {
      console.error('Error decoding file name:', error);
    }
  }, [profile?.userCV]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataApply({ ...formDataApply, [name]: value });
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormDataApply({ ...formDataApply, [name]: value });
  };

  // pdf file
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfURL, setPdfURL] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfFileType, setPdfFileType] = useState("");

  const onPdfDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      if (selectedFile.type === "application/pdf") {
        setPdfFile(selectedFile);
        setPdfFileName(selectedFile.name);
        setPdfFileType(selectedFile.type);
      } else {
        showToastMessage(t("showToastMessage.invalidPDFFile"));
        setFormDataApply({ ...formDataApply, ["cv"]: null });
        setPdfFile(null);
        setPdfFileName("");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        setPdfURL(reader.result as string);
        setFormDataApply({ ...formDataApply, ["cv"]: selectedFile });
      };

      reader.readAsDataURL(selectedFile);


    }
  };

  const {
    getRootProps: getPdfRootProps,
    getInputProps: getPdfInputProps,
    isDragActive: isPdfDragActive,
  } = useDropzone({ onDrop: onPdfDrop });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const validateFormApply = () => {
    let errors: Partial<FormData> = {};
    let isValid = true;
    const phoneNumberRegex = /^\d+$/;

    if (!formDataApply.fullName.trim()) {
      errors.fullName = t("jobDetail.applyForm.validationErrors.fullNameRequired");
      isValid = false;
    }

    if (!formDataApply.email.trim()) {
      errors.email = t("jobDetail.applyForm.validationErrors.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formDataApply.email)) {
      errors.email = t("jobDetail.applyForm.validationErrors.emailInvalid");
      isValid = false;
    }

    if (
      formDataApply.phoneNumber.length < 10 ||
      formDataApply.phoneNumber.trim().length > 12 ||
      !phoneNumberRegex.test(formDataApply.phoneNumber)
    ) {
      errors.phoneNumber = t("jobDetail.applyForm.validationErrors.phoneNumberInvalid");
      isValid = false;
    }

    if (formDataApply.cv == null || formDataApply.cv === "") {
      errors.cv = t("jobDetail.applyForm.validationErrors.cvRequired");
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };



  const handleSubmitApply = async (e: React.FormEvent) => {
    e.preventDefault();
    // formDataCmt.review_text = editorHtml;
    if (user === null) {
      showToastMessage(t("showToastMessage.pleaseLogin"));
      return;
    }
    if (validateFormApply()) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('jobId', jobId ? jobId.toString() : '');
      if (formDataApply.cv) {
        formData.append('cv', formDataApply.cv);
      }
      formData.append('fullName', formDataApply.fullName);
      formData.append('email', formDataApply.email);
      formData.append('phoneNumber', formDataApply.phoneNumber);
      formDataApply.coverletter = editorHtmlApply;
      formData.append('coverletter', formDataApply.coverletter);
      try {
        const response = await fetch("http://localhost:8080/auth/applyJob", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          body: formData,
        });

        if (response.ok) {
          setIsLoading(false);
          closeModal();
          showToastMessage(t("showToastMessage.thanksApply"));
          setIsButtonDisabled(true);

        } else {
          setIsLoading(false);
        }
      } catch (error: any) {
        console.log("Error fetching API:", error);
        setIsLoading(false);
      }
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
    return `${year}-${month}-${day} (${hours}:${minutes})`;
  }

  if (isLoading) {
    return <SpinnerLoading />;
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="col-lg-8">
        <div className="d-flex align-items-center mb-5">
          {props.job?.jobImg ? (
            <img className="flex-shrink-0 img-fluid border rounded" src={props.job?.jobImg} alt="" style={{ width: "80px", height: "80px", objectFit: 'contain' }} />
          ) : (
            <img className="flex-shrink-0 img-fluid border rounded" src="../assets/img/com-logo-1.jpg" alt="" style={{ width: "80px", height: "80px", objectFit: 'contain' }} />
          )}
          <div className="text-start ps-4">
            <h2 className="mb-3">{props.job?.title}</h2>
            <span className="text-truncate me-3">
              <i className="fa fa-map-marker-alt text-primary me-2"></i>{props.job?.location}
            </span>
            <span className="text-truncate me-3">
              <i className="far fa-clock text-primary me-2"></i>{t('jobDetail.details.left.fullTime')}
            </span>
            <span className="text-truncate me-0">
              <i className="far fa-money-bill-alt text-primary me-2"></i>
              {props.job?.salary}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <h4 className="mb-3">{t('jobDetail.details.left.descriptions')}</h4>
          <p dangerouslySetInnerHTML={{ __html: props.job?.description || "" }}></p>
          <h4 className="mb-3">{t('jobDetail.details.left.responsibilities')}</h4>
          <p dangerouslySetInnerHTML={{ __html: props.job?.requirements || "" }}></p>
          <ul className="list-unstyled">
            <li>
              <i className="fa fa-angle-right text-primary me-2"></i>{t('jobDetail.details.left.requirements.requirements1')}
            </li>
            <li>
              <i className="fa fa-angle-right text-primary me-2"></i>{t('jobDetail.details.left.requirements.requirements2')}
            </li>
          </ul>
          <h4 className="mb-3">{t('jobDetail.details.left.qualifications.qualifications')}</h4>
          <ul className="list-unstyled">
            <li>
              <i className="fa fa-angle-right text-primary me-2"></i>{t('jobDetail.details.left.qualifications.qualifications1')}
            </li>
            <li>
              <i className="fa fa-angle-right text-primary me-2"></i>{t('jobDetail.details.left.qualifications.qualifications2')}
            </li>
            <li>
              <i className="fa fa-angle-right text-primary me-2"></i>{t('jobDetail.details.left.qualifications.qualifications3')}
            </li>
            <li>
              <i className="fa fa-angle-right text-primary me-2"></i>{t('jobDetail.details.left.qualifications.qualifications4')}
            </li>
          </ul>
        </div>

        <div className="mt-5">
          <h4>{t("comment.review_rating")}</h4>

          {/* Thống kê số sao và số comment */}
          <div className="row mt-4">
            <div className="col-md-6">
              <h4>{t("comment.statistic")}</h4>
              {avgRating > 0 ? (
                <>
                  {[...Array(5)].map((star, index) => {
                    const currentRating = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={4}
                          style={{ display: "none", cursor: "pointer" }}
                        />
                        <FaStar
                          size={25}
                          color={
                            currentRating <= avgRating ? "#ffc107" : "#b0b0b0"
                          }
                        />
                      </label>
                    );
                  })}
                  <br />
                  <h3>({avgRating}/5)</h3>
                </>
              ) : (
                <p>{t("comment.no_review")}</p>
              )}
            </div>
            <div className="col-md-6">
              <h5>{t("comment.statistic")}</h5>
              <h6>{totalAmountOfRv} {t("comment.comments")}</h6>
            </div>
          </div>

          {/* Hiển thị các comment */}
          <div className="mt-4">
            {reviewAndRating.length > 0 && (
              <h5 className="fw-bold pb-2">Comments</h5>
            )}
            {reviewAndRating.length > 0 && reviewAndRating.map((reviewAndRating, index) => (
              <>
                <div className={styles.comments} key={index}>
                  <div id="comment" className={styles.comment}>
                    <div className="d-flex">
                      <div className={styles.commentImg}>
                        <img src="assets/img/blog/comments-1.jpg" alt="" />
                      </div>
                      <div>
                        <h6>
                          <Link to="#" style={{ color: "black" }}>
                            {reviewAndRating.user.email}
                          </Link>{" "}
                          <Link to="#"
                            className={styles.reply}
                            style={{ paddingLeft: "10px" }}
                          >
                            {/* <i className="bi bi-reply-fill"></i> Reply */}
                          </Link>
                        </h6>
                        <time dateTime={reviewAndRating.createdAt}>
                          {formatDateTime(reviewAndRating.createdAt)}
                        </time> <br />
                        {[...Array(5)].map((star, starIndex) => {
                          const currentRating = starIndex + 1;
                          return (
                            <label key={starIndex}>
                              <input
                                type="radio"
                                name="rating"
                                value={reviewAndRating.rating}
                                style={{ display: "none", cursor: "pointer" }}
                              />
                              <FaStar
                                size={15}
                                color={
                                  currentRating <= reviewAndRating.rating
                                    ? "#ffc107"
                                    : "#b0b0b0"
                                }
                              />
                            </label>
                          );
                        })}
                        <p key={`reviewText_${index}`} dangerouslySetInnerHTML={{ __html: reviewAndRating.reviewText }}></p>
                      </div>
                    </div>
                  </div>
                  <br />
                </div>
              </>
            )
            )}

            {totalPage > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                paginate={paginate}
              />
            )}

          </div>
          <div className="">
            <h5 className="fw-bold mb-3">{t("comment.review")}</h5>
            <form method="POST" onSubmit={handleSubmitCmt}>
              <div className="form-group">
                <label htmlFor="">{t("comment.ratings")}</label> <br />
                {[...Array(5)].map((star, index) => {
                  const currentRating = index + 1;
                  return (
                    <label>
                      <input
                        type="radio"
                        name="rating"
                        value={currentRating}
                        onClick={() => setRating(currentRating)}
                        style={{ display: "none", cursor: "pointer" }}
                      />
                      <FaStar
                        size={20}
                        color={
                          currentRating <= (hoverRating || rating)
                            ? "#ffc107"
                            : "#b0b0b0"
                        }
                        onMouseEnter={() => setHoverRating(currentRating)}
                        onMouseLeave={() => setHoverRating(0)}
                      />
                    </label>
                  );
                })}
                <br />
                <label htmlFor="comment" className="mt-2">
                  {t("comment.content")}
                </label>
                <TextEditorReactQuill
                  value={editorHtmlCmt}
                  onChange={setEditorHtmlCmt}
                />
              </div>
              <button type="submit" className="btn btn-success mt-3">
                {t("btn.btnSend")}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-5">
          <div className="col-12 pt-5">
            {isButtonDisabled ? (
              <button className="btn btn-warning w-100" style={{ height: '45px' }} disabled>
                {t('btn.btnApplied')}
              </button>
            ) : (
              <button className="btn btn-success w-100" style={{ height: '45px' }} onClick={openModal}>
                {t('btn.btnApply')}
              </button>
            )}

          </div>
        </div>


        {applyNow && (
          <div id="modal" className="modal">
            <div className="modal-content text-center" style={{ maxHeight: "none" }}>
              <div className="pt-2">
                <h3 className="mb-4" style={{ color: '#00B074' }}> {t("jobDetail.applyForm.applyWelcome")}</h3>
                <hr />
                <form method="post" encType="multipart/form-data" onSubmit={handleSubmitApply}>
                  <div className="row g-3" style={{ color: 'black' }}>

                    <div className="col-12 col-sm-12">
                      <div className="mb-0 d-block" style={{ color: '#00b14f' }}><i className="bi bi-cloud-upload"></i> Upload File
                        {t("jobDetail.applyForm.applyWelcome1")}</div>
                      <input
                        type="file"
                        id="cv"
                        name="cv"
                        style={{ display: "none" }}
                        // {...getPdfRootProps()}
                        onChange={handleInputChange}
                      />
                      <label {...getPdfRootProps()} className="btn btn-light">{t("jobDetail.applyForm.chooseCV")}</label> <br />
                      <a className="fw-bold" style={{ color: '#00b14f' }} href={pdfURL}>{pdfFileName}</a> <br />
                      {formErrors.cv === null && (
                        <span className="error-message text-danger">{t("jobDetail.applyForm.validationErrors.cvRequired")}</span>
                      )}

                    </div>

                    <div className="col-12 col-sm-12">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="form-control"
                        placeholder={t("placeholders.fullName")}
                        style={{ color: '#191c24' }}
                        value={formDataApply.fullName}
                        // value={profile?.userName}
                        onChange={handleInputChange}
                      />
                      <span className="error-message input-group text-danger" >{formErrors.fullName}</span>
                    </div>
                    <div className="col-12 col-sm-6">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder={t("placeholders.email")}
                        style={{ color: '#191c24' }}
                        value={formDataApply.email}
                        onChange={handleInputChange}
                      />
                      <span className="error-message input-group text-danger" >{formErrors.email}</span>
                    </div>
                    <div className="col-12 col-sm-6">
                      <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        className="form-control"
                        placeholder={t("placeholders.phoneNumber")}
                        style={{ color: '#191c24' }}
                        value={formDataApply.phoneNumber}
                        onChange={handleInputChange}
                      />
                      <span className="error-message input-group text-danger" >{formErrors.phoneNumber}</span>
                    </div>

                    <div className="col-12">

                      <TextEditorReactQuill
                        value={editorHtmlApply}
                        onChange={setEditorHtmlCmtApply}
                      />
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-4">
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4">
                      <button className="btn btn-secondary w-100" onClick={closeModal} type="button">
                        {t("btn.btnClose")}
                      </button>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4">
                      <button className="btn btn-success w-100" type="submit">
                        {t("btn.btnApplyOne")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showToast === true && (
            <div className="position-fixed bottom-0 end-0 p-3 toast-message" style={{ zIndex: "999" }}>
              <div
                className={`toast ${showToast ? "show" : ""}`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div className="toast-header bg-success text-white" style={{ backgroundColor: '#198754', color: 'white' }}>
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

      </div>

    </>
  );
};