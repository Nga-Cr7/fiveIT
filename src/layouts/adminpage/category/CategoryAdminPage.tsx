import React, { ChangeEvent, useEffect, useState } from "react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Page404 } from "../../errors/Page404";
import { Pagination } from "../../utils/Pagination";
import { BlogModel } from "../../../models/BlogModel";
import ReactQuill from "react-quill";
import { JobCategoryModel } from "../../../models/JobCategoryModel";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { PhotoSizeSelectActual } from "@mui/icons-material";
import { CSVLink } from "react-csv";

interface ChartData {
  id: number;
  value: number;
  label: string;
  color: string;
}

export const CategoryAdminPage = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [cates, setCates] = useState<JobCategoryModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [catesPerPage] = useState(5);
  const [totalCates, setTotalCates] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchUrl, setSearchUrl] = useState("");
  const [search, setSearch] = useState("");
  const approval: string = "WAITING";
  const [editingCate, setEditingCate] = useState<JobCategoryModel | null>(null);
  const [edit, setEdit] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [EditorHtml, setEditorHtml] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageFileType, setImageFileType] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [data, setData] = useState<{ data: ChartData[] }[]>([]);
  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const token: any = localStorage.getItem("jwt_token");

  const fetchAllBlogs = async () => {
    try {
      let baseUrlForCate = "";
      if (searchUrl === "") {
        baseUrlForCate = `http://localhost:8080/auth/admin/getAllCategories?cateTitle=${search}&startDate=${startDate}&endDate=${endDate}&page=${currentPage - 1
          }&size=${catesPerPage}`;
        console.log("baseUrl", baseUrlForCate)
      } else {
        let searchWithPage = searchUrl.replace(
          "<currentPage>",
          `${currentPage - 1}`
        );
        baseUrlForCate = searchWithPage;
      }

      const response = await fetch(baseUrlForCate, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const loadedCates: JobCategoryModel[] = [];
        data.content.forEach((cateData: any) => {
          const cate = new JobCategoryModel(
            cateData.categoryId,
            cateData.categoryName,
            cateData.categoryImg,
            cateData.createdAt
          );

          loadedCates.push(cate);
        });

        setCates(loadedCates);
        if (updated) {
          setCurrentPage(1);
          setUpdated(false);
        }
        setTotalCates(data.totalElements);
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
    fetchAllBlogs();
  }, [currentPage, searchUrl, updated]);

  //RandomColor
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/auth/admin/getJobByCategory",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();

        const newData: ChartData[] = Object.entries(result.jobMap).map(
          ([label, value], id) => ({
            id,
            value: value as number,
            label,
            color: generateRandomColor(),
          })
        );

        setData([{ data: newData }]);
        console.log("data", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [updated]);

  const searchHandleChange = (
    searchKey: string,
    searchStartDate: string,
    searchEndDate: string,
  ) => {
    setCurrentPage(1);
    setEdit(false);

    let newURL = `http://localhost:8080/auth/admin/getAllCategories?cateTitle=${search}&startDate=${startDate}&endDate=${endDate}&page=<currentPage>&size=${catesPerPage}`;
    setSearchUrl(newURL);
  };

  interface FormData {
    categoryId: number;
    categoryName: string;
    categoryImg: File | null | string;
    createdAt: string;
  }

  const [formData, setFormData] = useState<FormData>({
    categoryId: 0,
    categoryName: "",
    categoryImg: null,
    createdAt: "",
  });

  const onImgDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      if (selectedFile.type.startsWith("image/")) {
        setImageFile(selectedFile);
        setImageFileName(selectedFile.name);
        setImageFileType(selectedFile.type);
      } else {
        showToastMessage(t("showToastMessage.invalidIMGFile"));
        setFormData({ ...formData, ["categoryImg"]: null });
        setImageFile(null);
        setImageFileName("");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageURL(reader.result as string);
        setFormData({ ...formData, ["categoryImg"]: selectedFile });
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
        `http://localhost:8080/auth/admin/uploadAvtCate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleSaveCate = async (e: React.FormEvent) => {
    e.preventDefault();
    // formDataCmt.review_text = editorHtml;
    if (validateForm()) {
      setIsLoading(true);

      const formDataa = new FormData();
      formDataa.append("cateName", formData.categoryName);
      formDataa.append("urlImg", imageURL);
      try {
        const response = await fetch(
          "http://localhost:8080/auth/admin/saveCate",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataa,
          }
        );

        if (response.ok) {
          setIsLoading(false);
          showToastMessage(t("showToastMessage.saveSuccess"));
          setUpdated(true);
        } else {
          setIsLoading(false);
          errors.categoryName = t('showToastMessage.categoryNameExist');
        }
      } catch (error: any) {
        console.log("Error fetching API:", error);
        setIsLoading(false);
      }
    }
  };

  const handleUpdateCate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      const formDataa = new FormData();

      const cateId = editingCate?.categoryId?.toString();
      formDataa.append("cateId", cateId || "");
      formDataa.append("cateName", formData.categoryName);
      formDataa.append("urlImg", imageURL);

      try {
        const response = await fetch(
          "http://localhost:8080/auth/admin/updateCate",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataa,
          }
        );

        if (response.ok) {
          setIsLoading(false);
          showToastMessage(t("showToastMessage.updateSuccess"));
          setUpdated(true);
          handleNew();
        } else {
          setIsLoading(false);
          errors.categoryName = t("showToastMessage.categoryNameExist");
        }
      } catch (error: any) {
        console.log("Error fetching API:", error);
        setIsLoading(false);
      }
    }
  };

  const handleDeleteCate = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const formDataa = new FormData();

    const cateId = editingCate?.categoryId?.toString();

    try {
      const response = await fetch(
        `http://localhost:8080/auth/admin/deleteCate?cateId=${cateId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },

        }
      );

      if (response.ok) {
        setIsLoading(false);
        showToastMessage(t("showToastMessage.deleteSuccess"));
        setUpdated(true);
        handleNew();
      } else {
        setIsLoading(false);
        showToastMessage(t("showToastMessage.deleteFailed"));
      }
    } catch (error: any) {
      console.log("Error fetching API:", error);
      setIsLoading(false);
    }

  };

  const handleEditBlog = (Cate: JobCategoryModel) => {
    setEditingCate(Cate);
    setEdit(true);
    setIsEditMode(true);
    setImageURL(Cate.categoryImg);
    setFormData({
      categoryId: Cate.categoryId || 0,
      categoryName: Cate.categoryName || "",
      categoryImg: Cate.categoryImg || null,
      createdAt: Cate.createdAt || "",
    });
    // setEditorHtml(Cate.blogContent);
    formErrors.categoryName = "";
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smooth scrolling
    });
  };

  const handleCancel = () => {
    setEditingCate(null);
    setEdit(false);
    setIsEditMode(false);
    setEditorHtml("");
  };

  const [isEditMode, setIsEditMode] = useState(false);

  const handleNew = () => {
    setIsEditMode(false);
    setImageURL("");
    setFormData({
      categoryId: 0,
      categoryName: "",
      categoryImg: "",
      createdAt: "",
    });
    setEditingCate(null);
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({ onDrop: onImgDrop });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const errors: Partial<FormData> = {};
  const validateForm = () => {
    let isValid = true;

    if (formData.categoryName.trim().length < 3) {
      errors.categoryName = t("formErrors.invalidCategory");
      isValid = false;
    }
    // if (!imageURL) {
    //   errors.categoryImg = t("formErrors.invalidImg");
    //   isValid = false;
    // }
    setFormErrors(errors);
    return isValid;
  };

  // const handleSave = () => {
  //   handleSaveCate();
  // };

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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <Page404 error={httpError} />;
  }
  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            {editingCate ? (
              <div className="card">
                <div className="card-body">
                  <form
                    // method="PUT"
                    className="col-md-12 d-flex align-items-center justify-content-center flex-column"
                  >
                    <div className="text-center mb-2">
                      <label htmlFor="fileInput" className="file-input-label">
                        <div
                          className="image-container"
                          style={{ position: "relative" }}
                        >
                          <div
                            {...getImageRootProps()}
                            style={{ position: "relative" }}
                          >
                            <input {...getImageInputProps()} />
                            {imageURL ? (
                              <img
                                src={imageURL}
                                className="img-fluid rounded-circle"
                                style={{
                                  width: "10em",
                                  objectFit: "fill",
                                  height: "150px",
                                }}
                                alt="profile-image"
                              />
                            ) : (
                              <img
                                src="https://res.cloudinary.com/dzqoi9laq/image/upload/v1699419757/logoo_pyz2sp.png"
                                className="img-fluid rounded-circle"
                                style={{
                                  width: "10em",
                                  objectFit: "fill",
                                  height: "150px",
                                }}
                                alt="profile-image"
                              />
                            )}
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                            </div>
                          </div>
                        </div>
                      </label>{" "}
                      <br />
                      {/* {formErrors.categoryImg ? (
                        <label htmlFor="categoryImg">
                          <span className="error-message text-danger">
                            {t('formErrors.invalidImg')}
                          </span>
                        </label>
                      ) : (
                        ""
                      )} */}
                    </div>
                    <div className="col-md-8">
                      <div className="mb-3 ms-2 me-2">
                        <label
                          htmlFor="title"
                          className="form-label fw-bold ms-2"
                        >
                          {t("placeholders.title")}
                        </label>
                        <input
                          type="text"
                          name="categoryName"
                          id="categoryName"
                          value={formData.categoryName || ""}
                          className="form-control"
                          placeholder=""
                          onChange={handleInputChange}

                        />
                        {formErrors.categoryName ? (
                          <label htmlFor="categoryName">
                            <span className="error-message text-danger">
                              {formErrors.categoryName}
                            </span>
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="mb-3 ms-2 me-2">
                        <label
                          htmlFor="author"
                          className="form-label fw-bold ms-2"
                        >
                          {t("placeholders.createdBy")}
                        </label>
                        <input
                          type="text"
                          name="author"
                          value="Admin"
                          className="form-control"
                          placeholder="Author"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        // onClick={approveBlog}
                        onClick={handleNew}
                      >
                        {t("btn.btnNew")}
                      </button>
                      <button
                        className="btn btn-success ms-3"
                        type="button"
                        onClick={handleSaveCate}
                        disabled={isEditMode}
                      >
                        {t("btn.btnSave")}
                      </button>
                      <button
                        className="btn btn-warning ms-3"
                        onClick={handleUpdateCate}
                        disabled={!isEditMode}
                      >
                        {t("btn.btnUpdate")}
                      </button>

                      <button
                        className="btn btn-danger ms-3"
                        onClick={handleDeleteCate}
                        disabled={!isEditMode}
                      >
                        {t("btn.btnDelete")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-body">
                  <form
                    // method="PUT"
                    className="col-md-12 d-flex align-items-center justify-content-center flex-column"
                  >
                    <div className="text-center mb-2">
                      <label htmlFor="fileInput" className="file-input-label">
                        <div
                          className="image-container"
                          style={{ position: "relative" }}
                        >
                          <div
                            {...getImageRootProps()}
                            style={{ position: "relative" }}
                          >
                            <input {...getImageInputProps()} />
                            {imageURL ? (
                              <img
                                src={imageURL}
                                className="img-fluid rounded-circle"
                                style={{
                                  width: "10em",
                                  objectFit: "fill",
                                  height: "150px",
                                }}
                                alt="profile-image"
                              />
                            ) : (
                              <img
                                src="https://res.cloudinary.com/dzqoi9laq/image/upload/v1699419757/logoo_pyz2sp.png"
                                className="img-fluid rounded-circle"
                                style={{
                                  width: "10em",
                                  objectFit: "fill",
                                  height: "150px",
                                }}
                                alt="profile-image"
                              />
                            )}
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                            </div>
                          </div>
                        </div>
                      </label>{" "}
                      <br />
                      {/* {formErrors.categoryImg ? (
                        <label htmlFor="categoryImg">
                          <span className="error-message text-danger">
                            {t('formErrors.invalidImg')}
                          </span>
                        </label>
                      ) : (
                        ""
                      )} */}
                    </div>
                    <div className="col-md-8">
                      <div className="mb-3 ms-2 me-2">
                        <label
                          htmlFor="title"
                          className="form-label fw-bold ms-2"
                        >
                          {t("placeholders.title")}
                        </label>
                        <input
                          type="text"
                          name="categoryName"
                          id="categoryName"
                          value={formData.categoryName || ""}
                          className="form-control"
                          placeholder=""
                          onChange={handleInputChange}
                        />
                        {formErrors.categoryName ? (
                          <label htmlFor="categoryName">
                            <span className="error-message text-danger">
                              {formErrors.categoryName}
                            </span>
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="mb-3 ms-2 me-2">
                        <label
                          htmlFor="author"
                          className="form-label fw-bold ms-2"
                        >
                          {t("placeholders.createdBy")}
                        </label>
                        <input
                          type="text"
                          name="author"
                          value="Admin"
                          className="form-control"
                          placeholder="Author"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        // onClick={approveBlog}
                        onClick={handleNew}
                      >
                        {t("btn.btnNew")}
                      </button>
                      <button
                        className="btn btn-success ms-3"
                        type="button"
                        onClick={handleSaveCate}
                        disabled={isEditMode}
                      >
                        {t("btn.btnSave")}
                      </button>
                      <button
                        className="btn btn-warning ms-3"
                        onClick={handleUpdateCate}
                        disabled={!isEditMode}
                      >
                        {t("btn.btnUpdate")}
                      </button>
                      <button
                        className="btn btn-danger ms-3"
                        onClick={handleDeleteCate}
                        disabled={!isEditMode}
                      >
                        {t("btn.btnDelete")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-6 ">
            <PieChart
              margin={{ left: 100, right: 320 }}
              series={[
                {
                  arcLabel: (item) => ` ${item.value}`,
                  arcLabelMinAngle: 30,
                  data: data.length > 0 ? data[0].data : [],
                  innerRadius: 10,
                  outerRadius: 100,
                  paddingAngle: 1,
                  cornerRadius: 5,
                },
              ]}
              colorScale={
                data.length > 0 ? data[0].data.map((item) => item.color) : []
              }
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontWeight: "bold",
                },
              }}
              slotProps={{
                legend: {
                  direction: "column",
                  position: { vertical: "middle", horizontal: "right" },
                  padding: 0,
                },
              }}
              {...PhotoSizeSelectActual}
              height={300}
              className="img-fluid"
            />

          </div>
        </div>
      </div>
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-12">
            <div className="bg-light rounded h-100 p-4">
              {/* Search form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  searchHandleChange(search, startDate, endDate);
                }}
              >
                <div className="form-row">
                  <div className="row">
                    <div className="col-md-4 col-lg-4 mb-3">
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

                    <div className="col-md-2 col-lg-2 mb-3 text-center">
                      <button
                        className="btn btn-success btn-block"
                        type="button"
                        onClick={() =>
                          searchHandleChange(
                            search,
                            startDate,
                            endDate,
                          )
                        }
                      >
                        {t("searchForm.searchBtn")}
                      </button>
                    </div>

                    {cates.length > 0 && (
                      <div className="col-md-2 col-lg-1 mb-3">
                        <CSVLink
                          className="btn btn-success btn-block"
                          data={cates}
                          filename="Job Categories"
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
                {cates.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="text-center">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">{t("table.name")}</th>
                          <th scope="col">{t("table.createdBy")}</th>
                          <th scope="col">{t("table.img")}</th>
                          <th scope="col">{t("table.createdAt")}</th>
                          <th scope="col">{t("table.action")}</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {cates.map((cate, index) => (
                          <tr
                            key={cate.categoryId}
                            style={{ verticalAlign: "middle" }}
                          >
                            <th scope="row">{index + 1}</th>
                            <td>{cate.categoryName}</td>
                            <td>Admin</td>
                            <td>
                              <img
                                src={cate.categoryImg}
                                alt={`Profile image of ${cate.categoryImg}`}
                                className="text-start"
                                style={{
                                  maxWidth: "80px",
                                  maxHeight: "100px",
                                }}
                              />
                            </td>
                            <td>{formatDateTime(cate.createdAt)}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => handleEditBlog(cate)}
                              >
                                <i className="fa fa-pencil-alt"></i>{" "}
                                {t("btn.btnEdit")}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {totalPage >= 2 && (
                      <div className="mt-3">
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
                    <div className="background">{t("admin.noCate")}</div>
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
      )}
    </>
  );
};
