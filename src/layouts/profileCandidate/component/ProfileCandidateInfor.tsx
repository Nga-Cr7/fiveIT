import clsx from "clsx";
import style from "../css/style.module.css";
import { useAuth } from "../../utils/AuthProvide";
import { ProfileModel } from "../../../models/ProfileModel";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { ApplicantModel } from "../../../models/ApplicantModel";
import { JobCategoryModel } from "../../../models/JobCategoryModel";
import { JobModel } from "../../../models/JobModel";
import { UserModel } from "../../../models/UserModel";
import { useTranslation } from 'react-i18next';
export const ProfileCandidateInfor: React.FC<{
  profile?: ProfileModel;
  applicant: ApplicantModel[];
}> = (props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageFileType, setImageFileType] = useState("");

  // pdf file
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfURL, setPdfURL] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfFileType, setPdfFileType] = useState("");

  const [viewPDF, setViewPDF] = useState(false);
  const openCV = () => setViewPDF(true);
  const closeCV = () => setViewPDF(false);

  // pdf file in apply
  const [pdfApplyURL, setPdfApplyURL] = useState("");
  const [pdfApplyFileName, setPdfApplyFileName] = useState("");
  const [viewPDFApply, setViewPDFApply] = useState(false);

  const openCVApply = (pdfURL: any) => {
    setViewJob(false);
    setPdfApplyURL(pdfURL);
    setPdfApplyFileName(extractAndDecodeFileName(pdfURL));
    setViewPDFApply(true);
  };

  const closeCVApply = () => {
    setViewJob(true);
    setPdfApplyURL("");
    setPdfApplyFileName("");
    setViewPDFApply(false);
  };

  // coverletter in apply
  const [fieldContent, setFieldContent] = useState("");
  const [fieldApply, setFieldApply] = useState(false);

  const openFieldApply = (content: any) => {
    setViewJob(false);
    setFieldContent(content);
    setFieldApply(true);
  };

  const closeFieldApply = () => {
    setViewJob(true);
    setFieldContent("");
    setFieldApply(false);
  };

  const [viewJob, setViewJob] = useState(false);
  const openJob = () => setViewJob(true);
  const closeJob = () => setViewJob(false);

  const [changePassword, setChangePassword] = useState(false);
  const openChangePass = () => setChangePassword(true);
  const closeChangePass = () => setChangePassword(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorChangingPassword, setErrorChangingPassword] = useState("");
  const [successChangingPassword, setSuccessChangingPassword] = useState("");

  useEffect(() => {
    if (props.profile?.userImg) {
      setImageURL(props.profile.userImg);
    }
    if (props.profile?.userCV) {
      setPdfURL(props.profile?.userCV);
    }
  }, []);

  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const onImageDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      if (selectedFile.type.startsWith("image/")) {
        setImageFileName(selectedFile.name);
        setImageFileType(selectedFile.type);
        setImageFile(selectedFile);
      } else {
        showToastMessage(t('showToastMessage.invalidIMGFile'));
        if (!imageFileName) {
          setImageFileName("");
        }
        return;
      }
      const reader = new FileReader();

      reader.onload = () => {
        setImageURL(reader.result as string);
        // Move the handleImgUpload call here
        handleImgUpload(selectedFile);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImgUpload = async (selectedFile: File) => {
    setIsLoading(true); // Set loading to true before starting the upload process

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `http://localhost:8080/auth/profile/uploadAvtProfile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.text();
      const userImgUrl = data;
      setImageURL(userImgUrl);
    } catch (error) {
      console.log("Error uploading file:", error);
    } finally {
      setIsLoading(false); // Set loading to false after the upload process completes (whether it succeeds or fails)
    }
  };

  useEffect(() => {
    const fileUrl = props.profile?.userCV;
    try {
      // Extracting the file name from the URL
      if (fileUrl) {
        const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        const decodedFileName = decodeURIComponent(fileName);
        setPdfFileName(decodedFileName);
      }
      // Decoding the URL-encoded file name
    } catch (error) {
      console.error("Error decoding file name:", error);
    }
  }, []);

  function extractAndDecodeFileName(fileUrl: any) {
    const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const decodedFileName = decodeURIComponent(fileName);
    return decodedFileName;
  }

  const onPdfDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      if (selectedFile.type === "application/pdf") {
        setPdfFileType(selectedFile.type);
        setPdfFile(selectedFile);
        setPdfFileName(selectedFile.name);
      } else {
        showToastMessage(t('showToastMessage.invalidPDFFile'));
        if (!pdfFileName) {
          setPdfFileName("");
        }
        return;
      }
      const reader = new FileReader();

      reader.onload = () => {
        setPdfURL(reader.result as string);
        handleCvUpload(selectedFile);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCvUpload = async (selectedFile: File) => {
    setIsLoading(true); // Set loading to true before starting the upload process

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `http://localhost:8080/auth/profile/uploadCvProfile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.text();
      const userCvUrl = data;
      setPdfURL(userCvUrl);
    } catch (error) {
      console.log("Error uploading file:", error);
    } finally {
      setIsLoading(false); // Set loading to false after the upload process completes (whether it succeeds or fails)
    }
  };

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({ onDrop: onImageDrop });

  const {
    getRootProps: getPdfRootProps,
    getInputProps: getPdfInputProps,
    isDragActive: isPdfDragActive,
  } = useDropzone({ onDrop: onPdfDrop });

  // ----------
  const handleChangePasswordModal = () => {
    setErrorChangingPassword("");
    setSuccessChangingPassword("");
    setChangePassword(!changePassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChangePassWordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const currentPassword = (
      document.getElementById("currentPassword") as HTMLInputElement
    ).value;
    const newPassword = (
      document.getElementById("newPassword") as HTMLInputElement
    ).value;
    const confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement
    ).value;

    if (newPassword.length < 6) {
      setErrorChangingPassword("Password has to have 6 characters");
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        newPassword
      )
    ) {
      setErrorChangingPassword(t('formErrors.invalidPassword'))
    }
    else if (newPassword ===currentPassword) {
      setErrorChangingPassword(t('formErrors.currentMatchNewPass'));
    }
    else if (newPassword !== confirmPassword) {
      setErrorChangingPassword(t('formErrors.notMatchPassword'));
    } else {
      try {
        const response = await fetch(
          `http://localhost:8080/auth/profile/changePassword`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`, // Add the token here
            },
            body: JSON.stringify({
              currentPassword: currentPassword,
              newPassword: newPassword,
            }),
          }
        );

        if (response.ok) {
          const data = await response.text();
          console.log(data);
          setIsLoading(false);
          setErrorChangingPassword("");
          setSuccessChangingPassword(data);
          setTimeout(() => {
            handleChangePasswordModal();
          }, 3000);
        } else {
          const data = await response.text();
          console.log(data);
          setIsLoading(false);
          setSuccessChangingPassword("");
          setErrorChangingPassword(data);
        }
      } catch (error) {
        console.log("Network error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  // view job applied
  const [userId, setUserId] = useState("");
  const [applicantByUser, setApplicantByUser] = useState<ApplicantModel[]>([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/getUserId", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (response.ok) {
          const id = await response.text();
          setUserId(id);
        }
      } catch (error) {
        console.log("Error fetching API:", error);
      }
    };

    if (user) {
      fetchUserId();
    }
  }, [user]);

  useEffect(() => {
    const fetchApply = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/applicants/search/findApplicantByUserId?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (response.ok) {
          const list = await response.json();
          const applyData = list._embedded.applicants;

          const applicantModels: ApplicantModel[] = [];

          for (const key in applyData) {
            const jobInApplicantResponse = await fetch(
              applyData[key]._links.job.href
            );

            const userInApplicantResponse = await fetch(
              applyData[key]._links.user.href
            );

            const jobInApplicantInRvDataResponse =
              await jobInApplicantResponse.json();
            const userInApplicantInRvDataResponse =
              await userInApplicantResponse.json();

            const dataJobCate = await fetch(
              jobInApplicantInRvDataResponse._links.jobCategory.href
            );

            const dataJobCateResponse = await dataJobCate.json();

            const userApply: UserModel = {
              userId: userInApplicantInRvDataResponse.categoryId,
              userName: userInApplicantInRvDataResponse.email,
              phoneNumber: userInApplicantInRvDataResponse.email,
              email: userInApplicantInRvDataResponse.email,
              status: userInApplicantInRvDataResponse.status,
            };

            const jobCateData: JobCategoryModel = {
              categoryId: dataJobCateResponse.categoryId,
              categoryName: dataJobCateResponse.categoryName,
              categoryImg: dataJobCateResponse.categpryImg,
              createdAt: dataJobCateResponse.createdAt
            };

            const jobForApply: JobModel = {
              jobId: jobInApplicantInRvDataResponse.jobId,
              title: jobInApplicantInRvDataResponse.title,
              jobCategory: jobCateData,
              userId: null,
              jobImg: jobInApplicantInRvDataResponse.jobImg,
              description: jobInApplicantInRvDataResponse.description,
              requirements: jobInApplicantInRvDataResponse.requirements,
              location: jobInApplicantInRvDataResponse.location,
              salary: jobInApplicantInRvDataResponse.salary,
              status: jobInApplicantInRvDataResponse.status,
              applicationDeadline:
                jobInApplicantInRvDataResponse.applicationDeadline,
              createdAt: jobInApplicantInRvDataResponse.createdAt,
              createdBy: jobInApplicantInRvDataResponse.createdBy,
              approval: jobInApplicantInRvDataResponse.approval,
              quantityCv: jobInApplicantInRvDataResponse.quantityCv,
            };

            const applicant = new ApplicantModel(
              applyData[key].applicantId,
              jobForApply,
              userApply,
              applyData[key].fullName,
              applyData[key].email,
              applyData[key].phoneNumber,
              applyData[key].cv,
              applyData[key].coverletter,
              applyData[key].status,
              applyData[key].createdAt,
              applyData[key].message
            );
            applicantModels.push(applicant);
          }
          setApplicantByUser(applicantModels);
        }
      } catch (error) {
        console.log("Error fetching API:", error);
      }
    };

    if (userId) {
      fetchApply();
    }
  }, [userId, user]);

  const [currentTab, setCurrentTab] = useState("waiting"); // Mặc định là tab 'waiting'

  const filteredApplicants = applicantByUser.filter((applyItem) => {
    if (currentTab === "waiting") {
      return applyItem.status === "WAITING";
    } else if (currentTab === "approved") {
      return applyItem.status === "APPROVED";
    } else if (currentTab === "closed") {
      return applyItem.status === "CLOSE";
    }
    return true;
  });

  const generateRandomString = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*()_+";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  function redirectToJobDetail(jobId: any) {
    const randomString = generateRandomString(50);
    const encodedRandomString = encodeURIComponent(randomString);
    const jobDetailLink = `/jobDetail/${encodedRandomString}-${jobId}-${encodedRandomString}`;
    navigate(jobDetailLink);
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

  return (
    <>
      <div className="row">
        <div className={style.card}>
          <div className="card-body">
            <div className="d-flex align-items-start">
              <div className="avt-img text-center">
                <div {...getImageRootProps()} className={style.avtContainer}>
                  {/*  */}
                  <input {...getImageInputProps()} />
                  {imageURL ? (
                    <img
                      // src={props.profile?.userImg}
                      src={imageURL}
                      className={clsx(
                        style.avatarLg,
                        style.roundedCircle,
                        style.imgThumbnail
                      )}
                      alt="profile-image"
                      id={style.profileImg}
                    />
                  ) : (
                    <img
                      // src={props.profile?.userImg}
                      src="https://res.cloudinary.com/dzqoi9laq/image/upload/v1696927237/bd120fa2-a147-4334-a93b-3c97de240af3.png"
                      className={clsx(
                        style.avatarLg,
                        style.roundedCircle,
                        style.imgThumbnail
                      )}
                      alt="profile-image"
                      id={style.profileImg}
                    />
                  )}

                  {/*  */}
                  <div className={style.cameraIcon} id={style.cameraIcon}>
                    <i className="bi bi-camera fs-1"></i>
                  </div>
                </div>
              </div>
              <div className="w-100 ms-3">
                <h3 className="my-0 fw-bolder fs-4">
                  {props.profile?.userName}
                </h3>
                <p className="text-muted font-13 mb-3">{props.profile?.bio}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-muted mb-2 font-13">
                <strong>{t('placeholders.fullName')} :</strong>
                <span className="ms-2">{props.profile?.userName}</span>
              </p>
              <p className="text-muted mb-2 font-13">
                <strong>{t('placeholders.phoneNumber')} :</strong>
                <span className="ms-2">{props.profile?.phoneNumber}</span>
              </p>
              <p className="text-muted mb-2 font-13">
                <strong>{t('placeholders.email')} :</strong>
                <span className="ms-2">
                  <a
                    href="/cdn-cgi/l/email-protection"
                    className="__cf_email__"
                    data-cfemail="5d282e382f1d38303c3431733932303c3433"
                  >
                    {user?.name}
                  </a>
                </span>
              </p>
              <p className="text-muted mb-1 font-13">
                <strong>{t('placeholders.address')} :</strong>{" "}
                <span className="ms-2">{props.profile?.address}</span>
              </p>
            </div>
            <ul className="social-list list-inline mt-3 mb-0">
              <li className="list-inline-item">
                <a
                  href="#"
                  className="social-list-item text-center border-primary text-primary"
                >
                  <i className="mdi mdi-facebook" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={style.card}>
          <div className="card-body text-center">
            <div className="row">
              <div className="col-4 border-end border-light">
                <h5 className="text-muted mt-1 mb-2 fw-normal">{t('profile.myCV')}</h5>
                <Link
                  {...getPdfRootProps()}
                  to=""
                  className="mb-0 fw-bold d-block"
                >
                  {t('btn.btnUploadCV')}
                </Link>
                <a style={{ fontSize: "12px" }}>{pdfFileName}</a> <br />
                {pdfFileName && (
                  <div>
                    <a
                      href="#"
                      data-toggle="modal"
                      data-target="#pdfModal"
                      onClick={openCV}
                    >
                      {t('btn.btnViewCV')}
                    </a>
                  </div>
                )}
                <input
                  id="pdfInput"
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  {...getPdfInputProps()}
                />
              </div>

              <div className="col-4 border-end border-light">
                <h5 className="text-muted mt-1 mb-2 fw-normal">{t('profile.jobApplied')}</h5>
                <h2 className="mb-0 fw-bold">{props.applicant.length}</h2>
                {props.applicant.length > 0 && (
                  <div>
                    <a
                      href="#"
                      className="fw-bold"
                      data-toggle="modalJob"
                      data-target="#pdfModal"
                      onClick={openJob}
                    >
                      {t('btn.btnViewJobs')}
                    </a>
                  </div>
                )}
              </div>

              <div className="col-4 border-end border-light">
                <h5 className="text-muted mt-1 mb-2 fw-normal">
                  {t('profile.changePassword')}
                </h5>

                <a
                  href="#"
                  className="fw-bold"
                  data-toggle="modal"
                  data-target="modal"
                  onClick={openChangePass}
                >
                  {t('btn.btnChangePassword')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewPDF && (
        <div id="modal" className="modal" onClick={closeCV}>
          <div className="modal-content w-100 h-100" style={{}}>
            <div className="modal-body">
              <iframe src={pdfURL} width="100%" height="100%">
                {pdfFileName}
              </iframe>
            </div>
            <button className="btnClose bg-success text-white" onClick={closeCV}>
              {t('btn.btnClose')}
            </button>
          </div>
        </div>
      )}

      {viewPDFApply && (
        <div id="modalPDFApply" className="modal">
          <div className="modal-content w-100 h-100" style={{ zIndex: 1052 }}>
            <div className="modal-body">
              <iframe src={pdfApplyURL} width="100%" height="100%">
                {pdfApplyFileName}
              </iframe>
            </div>
            <button className="btnClose bg-success text-white" onClick={closeCVApply}>
              {t('btn.btnClose')}
            </button>
          </div>
        </div>
      )}

      {fieldApply && (
        <div id="modalFieldApply" className="modal">
          <div className="">
            <div className="modal-content w-100 h-100" style={{ zIndex: 1052 }}>
              <div dangerouslySetInnerHTML={{ __html: fieldContent }}></div>

              <button className="btnClose bg-success text-white" onClick={closeFieldApply}>
                {t('btn.btnClose')}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewJob && (
        <div id="modalJob" className="modal">
          <div
            className="modal-content w-100 h-100"
            style={{ maxWidth: "1500px", zIndex: 1051, textAlign: "center" }}
          >
            <div className="">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link active fw-bold"
                    id="waiting-tab"
                    data-bs-toggle="tab"
                    href="#waiting"
                    role="tab"
                    aria-controls="waiting"
                    aria-selected="true"
                    onClick={() => setCurrentTab("waiting")}
                  >
                    {t('status.waiting')}
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link fw-bold"
                    id="approval-tab"
                    data-bs-toggle="tab"
                    href="#approval"
                    role="tab"
                    aria-controls="approval"
                    aria-selected="false"
                    onClick={() => setCurrentTab("approved")}
                  >
                    {t('status.approved')}
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link fw-bold"
                    id="closed-tab"
                    data-bs-toggle="tab"
                    href="#closed"
                    role="tab"
                    aria-controls="closed"
                    aria-selected="false"
                    onClick={() => setCurrentTab("closed")}
                  >
                    {t('status.closed')}
                  </a>
                </li>
              </ul>
            </div>
            <div className="">
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="waiting"
                  role="tabpanel"
                  aria-labelledby="waiting-tab"
                >
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "60vh", overflowY: "auto" }}
                  >
                    <table className="table custom-table no-footer">
                      <thead>
                        <tr>
                          <th>{t('table.img')}</th>
                          <th>{t('table.title')}</th>
                          <th>{t('table.name')}</th>
                          <th>{t('table.email')}</th>
                          <th>{t('table.phone')}</th>
                          <th>{t('table.CL')}</th>
                          <th>{t('table.CV')}</th>
                          <th>{t('table.date')}</th>
                          <th>{t('table.status')}</th>
                          <th>{t('table.message')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplicants.map((applyItem, index) => (
                          <tr key={applyItem.applicantId}>
                            <td>
                              <img
                                src={applyItem.job?.jobImg}
                                alt={applyItem.job?.jobImg}
                                style={{ width: "50px", height: "50px", objectFit:'contain' }}
                              />
                            </td>
                            <td
                              style={{ color: "#008374", cursor: "pointer" }}
                              onClick={() =>
                                redirectToJobDetail(applyItem.job?.jobId)
                              }
                            >
                              {applyItem.job?.title}
                            </td>
                            {/* <td>{applyItem.job?.jobCategory.categoryName}</td> */}
                            <td>{applyItem.fullName}</td>
                            <td>{applyItem.email}</td>
                            <td>{applyItem.phoneNumber}</td>
                            <td>
                              {applyItem.coverletter ? (
                                <p
                                  style={{
                                    color: "#008374",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    openFieldApply(applyItem.coverletter)
                                  }
                                >
                                  {t('btn.btnView')}
                                </p>
                              ) : (
                                <p>{t('table.noCoverLetter')}</p>
                              )}
                            </td>
                            <td>
                              <p
                                style={{
                                  color: "#008374",
                                  cursor: "pointer",
                                  // maxWidth: "30ch",
                                  // whiteSpace : "nowrap",
                                  // overflow : "hidden",
                                  // textOverflow: "ellipsis"
                                }}
                                onClick={() => openCVApply(applyItem.cv)}
                              >
                                {extractAndDecodeFileName(applyItem.cv)}
                              </p>
                            </td>
                            <td>{formatDateTime(applyItem.createdAt)}</td>
                            <td className="text-center">{applyItem.status}</td>
                            <td>
                              {applyItem.message ? (
                                <p
                                  style={{
                                    color: "#008374",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    openFieldApply(applyItem.message)
                                  }
                                >
                                  {t('btn.btnView')}
                                </p>
                              ) : (
                                <p>{t('table.noMessage')}</p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="approval"
                  role="tabpanel"
                  aria-labelledby="approval-tab"
                >
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "60vh", overflowY: "auto" }}
                  >
                    <table className="table custom-table no-footer">
                      <thead>
                        <tr>
                          <th>{t('table.img')}</th>
                          <th>{t('table.title')}</th>
                          <th>{t('table.name')}</th>
                          <th>{t('table.email')}</th>
                          <th>{t('table.phone')}</th>
                          <th>{t('table.CL')}</th>
                          <th>{t('table.CV')}</th>
                          <th>{t('table.date')}</th>
                          <th>{t('table.status')}</th>
                          <th>{t('table.message')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplicants.map((applyItem, index) => (
                          <tr key={applyItem.applicantId}>
                            <td>
                              <img
                                src={applyItem.job?.jobImg}
                                alt={applyItem.job?.jobImg}
                                style={{ width: "50px", height: "50px", objectFit:'contain' }}
                              />
                            </td>
                            <td
                              style={{ color: "#008374", cursor: "pointer" }}
                              onClick={() =>
                                redirectToJobDetail(applyItem.job?.jobId)
                              }
                            >
                              {applyItem.job?.title}
                            </td>
                            {/* <td>{applyItem.job?.jobCategory.categoryName}</td> */}
                            <td>{applyItem.fullName}</td>
                            <td>{applyItem.email}</td>
                            <td>{applyItem.phoneNumber}</td>
                            <td>
                              {applyItem.coverletter ? (
                                <p
                                  style={{
                                    color: "#008374",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    openFieldApply(applyItem.coverletter)
                                  }
                                >
                                  {t('btn.btnView')}
                                </p>
                              ) : (
                                <p>{t('table.noCoverLetter')}</p>
                              )}
                            </td>
                            <td>
                              <p
                                style={{
                                  color: "#008374",
                                  cursor: "pointer",
                                  // maxWidth: "30ch",
                                  // whiteSpace : "nowrap",
                                  // overflow : "hidden",
                                  // textOverflow: "ellipsis"
                                }}
                                onClick={() => openCVApply(applyItem.cv)}
                              >
                                {extractAndDecodeFileName(applyItem.cv)}
                              </p>
                            </td>
                            <td>{formatDateTime(applyItem.createdAt)}</td>
                            <td className="text-center">{applyItem.status}</td>
                            <td>
                              {applyItem.message ? (
                                <p
                                  style={{
                                    color: "#008374",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    openFieldApply(applyItem.message)
                                  }
                                >
                                  {t('btn.btnView')}
                                </p>
                              ) : (
                                <p>{t('table.noMessage')}</p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="closed"
                  role="tabpanel"
                  aria-labelledby="closed-tab"
                >
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "60vh", overflowY: "auto" }}
                  >
                    <table className="table custom-table no-footer">
                      <thead>
                        <tr>
                          <th>{t('table.img')}</th>
                          <th>{t('table.title')}</th>
                          <th>{t('table.name')}</th>
                          <th>{t('table.email')}</th>
                          <th>{t('table.phone')}</th>
                          <th>{t('table.CL')}</th>
                          <th>{t('table.CV')}</th>
                          <th>{t('table.date')}</th>
                          <th>{t('table.status')}</th>
                          <th>{t('table.message')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplicants.map((applyItem, index) => (
                          <tr key={applyItem.applicantId}>
                            <td>
                              <img
                                src={applyItem.job?.jobImg}
                                alt={applyItem.job?.jobImg}
                                style={{ width: "50px", height: "50px", objectFit:'contain' }}
                              />
                            </td>
                            <td
                              style={{ color: "#008374", cursor: "pointer" }}
                              onClick={() =>
                                redirectToJobDetail(applyItem.job?.jobId)
                              }
                            >
                              {applyItem.job?.title}
                            </td>
                            {/* <td>{applyItem.job?.jobCategory.categoryName}</td> */}
                            <td>{applyItem.fullName}</td>
                            <td>{applyItem.email}</td>
                            <td>{applyItem.phoneNumber}</td>
                            <td>
                              {applyItem.coverletter ? (
                                <p
                                  style={{
                                    color: "#008374",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    openFieldApply(applyItem.coverletter)
                                  }
                                >
                                  {t('btn.btnView')}
                                </p>
                              ) : (
                                <p>{t('table.noCoverLetter')}</p>
                              )}
                            </td>
                            <td>
                              <p
                                style={{
                                  color: "#008374",
                                  cursor: "pointer",
                                  // maxWidth: "30ch",
                                  // whiteSpace : "nowrap",
                                  // overflow : "hidden",
                                  // textOverflow: "ellipsis"
                                }}
                                onClick={() => openCVApply(applyItem.cv)}
                              >
                                {extractAndDecodeFileName(applyItem.cv)}
                              </p>
                            </td>
                            <td>{formatDateTime(applyItem.createdAt)}</td>
                            <td className="text-center">{applyItem.status}</td>
                            <td>
                              {applyItem.message ? (
                                <p
                                  style={{
                                    color: "#008374",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    openFieldApply(applyItem.message)
                                  }
                                >
                                  {t('btn.btnView')}
                                </p>
                              ) : (
                                <p>{t('table.noMessage')}</p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body"></div>
            <button className="btnClose bg-success text-white" onClick={closeJob}>
              {t('btn.btnClose')}
            </button>
          </div>
        </div>
      )}

      {changePassword && (
        <div id="modal" className="modal">
          <div className="modal-content w-50" style={{ textAlign: "center" }}>
            <div className="modal-title">
              <h4 className="m-0">
                {t('profile.changePassword')} <i className="bi bi-bell"></i>
              </h4>
            </div>
            <hr />
            {errorChangingPassword.length > 0 && (
              <p className="text-danger text-center">{errorChangingPassword}</p>
            )}
            {successChangingPassword.length > 0 && (
              <p className="text-success text-center">
                {successChangingPassword}
              </p>
            )}
            <div className="modal-body w-100">
              <div className="card shadow w-100">
                <div className="card-body w-100">
                  <div>
                    <Link to="/home">
                      <img
                        src="/logo.png"
                        style={{ width: "20%", height: "20%" }}
                        alt="logo-icon"
                      />
                    </Link>
                  </div>
                  <form method="post" onSubmit={handleChangePassWordSubmit}>
                    <div className="mb-3">
                      <input
                        type="password"
                        id="currentPassword"
                        className="form-control"
                        name="currentPassword"
                        placeholder={t('placeholders.currentPassword')}
                        required
                      />
                    </div>
                    <div className="mb-3 input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        className="form-control"
                        name="newPassword"
                        placeholder={t('placeholders.newPassword')}
                        required
                      />

                      <span
                        className="input-group-text"
                        onClick={togglePasswordVisibility}
                      >
                        <i
                          className={`bi bi-eye${showPassword ? "-slash" : ""}`}
                        ></i>
                      </span>
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        name="confirmPassword"
                        placeholder={t('placeholders.confirmNewPassword')}
                        required
                      />
                    </div>
                    <div className="mb-3 d-grid">
                      <button type="submit" className="btn btn-primary">
                        {t('btn.btnChangePassword')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <button className="btnClose bg-success text-white" onClick={handleChangePasswordModal}>
              {t('btn.btnClose')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
