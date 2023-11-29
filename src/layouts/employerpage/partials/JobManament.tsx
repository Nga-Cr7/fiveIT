import { useEffect, useState } from "react";
import { JobCategoryModel } from "../../../models/JobCategoryModel";
import { Category } from "../../homepage/components/Category";
import { useAuth } from "../../utils/AuthProvide";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { TextEditorReactQuill } from "../../utils/TextEditorReactQuill";
import { JobModel } from "../../../models/JobModel";
import { useDropzone } from "react-dropzone";
export const JobManament = () => {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(true); // Mặc định là "Enable"
  const [jobCate, setJobCate] = useState<JobCategoryModel[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("location");
  const [selectedCate, setSelectedCate] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [reEditorHtml, setReEditorHtml] = useState("");
  const [deEditorHtml, setDeEditorHtml] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageFileType, setImageFileType] = useState("");

  const handleEnableDisableChange = (event: any) => {
    setIsEnabled(event.target.value === "enable");
  };

  //form data

  interface FormData {
    title: string;
    salary: string;
    category: string;
    location: string;
    file:File | null;
    description: string;
    requirements: string;
    applicationDeadline: string;
  }

  const [formData, setFormData] = useState<FormData>({
    title: "",
    salary: "",
    category: "",
    location: "",
    file:null,
    description: "",
    requirements: "",
    applicationDeadline: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  //hanld input change value(read value input add to form)
  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  //upload avt job
  const onImageDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setImageFile(selectedFile);
      setImageFileName(selectedFile.name);
  
      const reader = new FileReader();
  
      reader.onload = () => {
        setImageURL(reader.result as string);
        setFormData({...formData, "file": selectedFile});
        // Move the handleImgUpload call here
        // handleImgUpload(selectedFile);
      };
  
      reader.readAsDataURL(selectedFile);
  
      if (selectedFile.type.startsWith("image/")) {
        setImageFileType(selectedFile.type);
      } else {
        alert("Invalid file type for images. Please select an image.");
        setImageFile(null);
      }
    }
  };

  //validate number
  function isNumeric(value: any) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  const validateForm = () => {
    let errors: Partial<FormData> = {};
    let isValid = true;

    if (formData.title.trim().length < 5) {
      errors.title = "Title has to greater than 5 letters";
      isValid = false;
    }
    if (!isNumeric(formData.salary) || !formData.salary) {
      errors.salary = "Please enter a valid numeric value";
      isValid = false;
    }

    if (deEditorHtml.trim().length < 10) {
      errors.description = "Description has to greater than 10 letters";
      isValid = false;
    }
    if (!selectedCate) {
      errors.category = "Pls!Choose Category";
      isValid = false;
    }
    if (!selectedLocation) {
      errors.location = "Pls!Choose Location";
      isValid = false;
    }
    if (reEditorHtml.trim().length < 10) {
      errors.requirements = "Requirements has to greater than 10 letters";
      isValid = false;
    }
    if (!formData.applicationDeadline) {
      errors.applicationDeadline = "Please select close date.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };


  //Submit form to save and updated
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formDataPost = new FormData()
    console.log("DATA NEW",formDataPost)
    const isValid = validateForm();
    if (isValid) {
      setIsLoading(true);
      if(formData.file){
        formDataPost.append("file",formData.file)
      }
      formDataPost.append("title",formData.title)
      formDataPost.append("cateId",selectedCate)
      formDataPost.append("location",selectedLocation)
      formDataPost.append("salary",formData.salary)
      formDataPost.append("description",deEditorHtml)
      formDataPost.append("requirements",reEditorHtml)
      formDataPost.append("applicationDeadline",formData.applicationDeadline)
      console.log("DMM NGUYEN",formDataPost);
      setTimeout(async () => {  
        try {
          const response = await fetch("http://localhost:8080/auth/employer/postJob", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user?.token}`, // Add the token here
            },
            body: formDataPost
        
          });

          console.log(formData);
          if (response.ok) {
            setIsLoading(false);
            showToastMessage("Post Job SuccessFully");
            setFormData({
              title: "",
              salary: "",
              category: "",
              location: "",
              file:null,  
              description: "",
              requirements: "",
              applicationDeadline: "",
            });

            setReEditorHtml("");
            setDeEditorHtml("");
          } else {
            setIsLoading(false);
            showToastMessage("Post Job Fail");
          }
        } catch (error) {
          // Handle network error
        } finally {
          setIsLoading(false);
        }
      }, 500);
    }
  };

  //fetch cate and location

  useEffect(() => {
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
      } catch (error: any) {}
    };
    fetchData();
  }, []);

  
  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({ onDrop: onImageDrop });

const cancelForm = ()=>{
  console.log("Cacel")
  setFormData({
    title: " ",
    salary: "",
    category: "",
    location: "",
    file:null,  
    description: "",
    requirements: "",
    applicationDeadline: "",
  });
  setSelectedCate("0")
  setSelectedLocation("location")
  setReEditorHtml("")
  setDeEditorHtml("")
  setImageURL("")
  }
  // loading and toast
  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (isLoading) {
    return <SpinnerLoading />;
  }
  return (
    <>
      <div className="me-5 page-wrapper">
        <div className="content container-fluid">
          <form method="POST" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-xl-12 col-sm-12 col-12">
                <div className="breadcrumb-path mb-4">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="index.html">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Jobs</li>
                  </ul>
                  <h3>Create Jobs</h3>
                </div>
              </div>
              <div className="col-xl-12 col-sm-12 col-12">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-titles">
                      Job Basic Details <span>Organized and secure.</span>
                    </h2>
                  </div>
                  <div className="card-body">
                    <div className="row">
                    <label htmlFor="" className="ms-4 fw-bold">Choose Image</label>
                      <div className="col-md-3">
                      <div {...getImageRootProps()} className="">
                  {/*  */}
                  <input {...getImageInputProps()} />
                  {imageURL ? (
                    <img
                      // src={props.profile?.userImg}
                      src={imageURL}
                      className="img"
                      alt="profile-image"
                      style={{height:"100px", width:"170px"}}
                    />
                  ) : (
                    <img
                      // src={props.profile?.userImg}
                      src="https://res.cloudinary.com/dzqoi9laq/image/upload/v1696927237/bd120fa2-a147-4334-a93b-3c97de240af3.png"
                      className="form-control"
                      alt="profile-image"
                      style={{height:"100px", width:"170px"}}
                      // id={style.profileImg}
                    />
                  )}

                  {/*  */}
                  {/* <div className={style.cameraIcon} id={style.cameraIcon}>
                    <i className="bi bi-camera fs-1"></i>
                  </div> */}
                </div>

                      </div>
                      <div className="form-group col-md-9">
                        <label htmlFor="bio" className="form-label fw-bold">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="name"
                          value={formData.title}
                          placeholder="Title"
                          onChange={handleInputChange}
                        />
                        {formErrors.title ? (
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
                            <label htmlFor="bio" className="form-label fw-bold">
                              Salary
                            </label>
                            <input
                              type="text"
                              name="salary"
                               value={formData.salary}
                              placeholder="Salary"
                              onChange={handleInputChange}
                            />
                            {formErrors.salary ? (
                              <label htmlFor="salary">
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
                        {/* <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="bio" className="form-label fw-bold">
                              Job Image
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              name="jobImg"
                              placeholder="Image"
                              onChange={handleInputChange}
                            />
                            {formErrors.jobImg ? (
                              <label htmlFor="jobImg">
                                {" "}
                                <span className="error-message text-danger">
                                  {formErrors.jobImg}
                                </span>
                              </label>
                            ) : (
                              ""
                            )}
                          </div>
                        </div> */}
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="bio" className="form-label fw-bold">
                              Date Close
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              name="applicationDeadline"
                              placeholder="Close Date"
                              value={formData.applicationDeadline}
                              onChange={handleInputChange}
                            />
                            {formErrors.applicationDeadline ? (
                              <label htmlFor="applicationDeadline">
                                {" "}
                                <span className="error-message text-danger">
                                  {formErrors.applicationDeadline}
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
                          <label htmlFor="bio" className="form-label fw-bold">
                            Category
                          </label>
                          <select
                            className="select"
                            value={selectedCate}
                            onChange={(e) => setSelectedCate(e.target.value)}
                          >
                            <option value="0">Category</option>
                            {jobCate.map((cate) => (
                              <option
                                key={cate.categoryId}
                                value={cate.categoryId}
                              >
                                {cate.categoryName}
                              </option>
                            ))}
                          </select>
                          {formErrors.category ? (
                          <label htmlFor="title">
                            {" "}
                            <span className="error-message text-danger">
                              {formErrors.category}
                            </span>
                          </label>
                        ) : (
                          ""
                        )}
                        </div>
                      </div>
                      <div className="col-xl-6 col-sm-12 col-12">
                        <div className="form-group">
                          <label htmlFor="bio" className="form-label fw-bold">
                            Location
                          </label>
                          <select
                            className="select"
                            onChange={(e) =>
                              setSelectedLocation(e.target.value)
                            }
                            value={selectedLocation}
                          >
                            <option value="">Location</option>
                            {location.map((loca, index) => (
                              <option key={index} value={loca}>
                                {loca}
                              </option>
                            ))}
                          </select>
                          {formErrors.location ? (
                          <label htmlFor="title">
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
                </div>
              </div>
              {/* req and des */}
              <div className="col-xl-12 col-sm-12 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="row">
                        <div className="form-group">
                          <label htmlFor="bio" className="form-label fw-bold">
                            Description
                          </label>
                          <TextEditorReactQuill
                            value={deEditorHtml}
                            onChange={setDeEditorHtml}
                          />
                          {formErrors.description ? (
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
                          <label htmlFor="bio" className="form-label fw-bold">
                            Requirement
                          </label>
                          <TextEditorReactQuill
                            value={reEditorHtml}
                            onChange={setReEditorHtml}
                          />
                          {formErrors.requirements ? (
                            <label htmlFor="requirements">
                              {" "}
                              <span className="error-message text-danger">
                                {formErrors.requirements}
                              </span>
                            </label>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12 col-sm-12 col-12">
                  <div className="form-btn">
                    <button type="submit" className="btn btn-apply w-auto">
                      Add Job
                    </button>
                    <button type="button" onClick={cancelForm} className="btn btn-secondary w-auto">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
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
            <strong className="me-auto">Update Profile Status</strong>
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
  );
};
