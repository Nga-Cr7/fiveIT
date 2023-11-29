import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../../utils/AuthProvide";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import ReactQuill from "react-quill";
import { Pagination } from "../../utils/Pagination";
import { BlogModel } from "../../../models/BlogModel";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export const EmployerApprovedBlogPage = () => {
  const { t } = useTranslation();

    const { user } = useAuth();
    const logoFiveIT = "https://res.cloudinary.com/dzqoi9laq/image/upload/v1699419757/logoo_pyz2sp.png";
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [EditorHtml, setEditorHtml] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState("");
    const [imageFileName, setImageFileName] = useState("");
    const [imageFileType, setImageFileType] = useState("");
    const [errorImg, setErrorImg] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(3);
    const [totalAmountOfBlogs, setTotalAmountOfBlogs] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [blogs, setBlogs] = useState<BlogModel[]>([]);
    const [httpError, setHttpError] = useState(null);
    const [view, setView] = useState(false);
    const navigate = useNavigate();

    const fetchAllContacts = async () => {
        const token = localStorage.getItem("jwt_token");
        try {
            const baseUrlForBlog = `http://localhost:8080/auth/employer/getBlogsEmployer?status=ENABLE&approval=APPROVED&page=${currentPage - 1}&size=${blogsPerPage}`;


            const response = await fetch(baseUrlForBlog, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();

                const loadedBlogs: BlogModel[] = [];

                data.content.forEach((blogData: any) => {
                    const blog = new BlogModel(
                        blogData.blogId,
                        blogData.userId,
                        blogData.blogTitle,
                        blogData.blogContent,
                        blogData.blogImg,
                        blogData.author,
                        blogData.status,
                        blogData.approval,
                        blogData.createdAt,
                        blogData.createdBy,
                        blogData.updatedAt,
                        blogData.updatedBy
                    )
                    loadedBlogs.push(blog);
                })
                setBlogs(loadedBlogs);

                console.log(loadedBlogs)
                setTotalAmountOfBlogs(data.totalElements);
                setTotalPage(data.totalPages);


                setIsLoading(false);
            } else {
                throw new Error('Request failed');
            }
        } catch (error: any) {
            setHttpError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllContacts();
    }, [currentPage]);



    const today = new Date().toISOString().split('T')[0]
    //form data

    interface FormData {
        title: string;
        blogContent: string;
        file: File | null;
        author: string;
    }

    const [formData, setFormData] = useState<FormData>({
        title: "",
        blogContent: "",
        file: null,
        author: ""
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
                setFormData({ ...formData, "file": selectedFile });

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

    //validate number
    function isNumeric(value: any) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
    //valiedate form
    const validateForm = () => {
        let errors: Partial<FormData> = {};
        let isValid = true;


        if (formData.title.trim().length < 10) {
            errors.title = t('formErrors.invalidTitle10');
            isValid = false;
        }
        if (EditorHtml.trim().length < 100) {
            errors.blogContent = t('formErrors.invalidContent');
            isValid = false;
        }
        if (formData.author.trim().length < 1) {
            errors.author = t('formErrors.invalidAuthor');
            isValid = false;
        }
        if (!formData.file) {
            setErrorImg(t('formErrors.invalidImg'))
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };


    //Submit form to save and updated
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formDataPost = new FormData()
        console.log("DATA NEW", formDataPost)
        const isValid = validateForm();
        if (isValid) {
            console.log("aaaaa")
            setIsLoading(true);
            if (formData.file) {
                formDataPost.append("blogImg", formData.file)
            } else {
                formDataPost.append("defaultImg", logoFiveIT)
                console.log(logoFiveIT);
            }
            formDataPost.append("blogTitle", formData.title)
            formDataPost.append("blogContent", EditorHtml)
            formDataPost.append("author", formData.author)
            setTimeout(async () => {
                try {
                    const response = await fetch("http://localhost:8080/auth/employer/postBlogEmployer", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${user?.token}`, // Add the token here
                        },
                        body: formDataPost

                    });

                    console.log(formData);
                    if (response.ok) {
                        setIsLoading(false);
                        showToastMessage(t('showToastMessage.successBlogPostWaiting'));
                        setFormData({
                            title: "",
                            file: null,
                            blogContent: "",
                            author: "",
                        });
                        setView(false);
                        setImageURL("")
                        setEditorHtml("");
                    } else {
                        setIsLoading(false);
                        showToastMessage(t('showToastMessage.errorBlogPost'));
                    }
                } catch (error) {
                    // Handle network error
                } finally {
                    setIsLoading(false);
                }
            }, 500);
        }
    };


    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({ onDrop: onImageDrop });

    const cancelForm = () => {
        setView(false)
        setFormData({
            title: " ",
            file: null,
            blogContent: "",
            author: "",
        });
        setEditorHtml("");
        setImageURL("")
    }


    const handleViewClick = (blog: BlogModel) => {
        setView(true)
        setFormData({
            title: blog.blogTitle,
            file: null,
            blogContent: blog.blogContent,
            author: blog.author,
        });
        setEditorHtml(blog.blogContent);
        setImageURL(blog.blogImg);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    // loading and toast


    const showToastMessage = (message: string) => {
        setMessage(message);
        setShowToast(true);
        if (message === t('showToastMessage.successBlogPostWaiting')) {
            const toastMessage = document.querySelector('.toast-message');
            if (toastMessage) {
                toastMessage.addEventListener('click', () => {
                    navigate('/waitingEmployerBlogs'); // Replace '/home' with the actual URL of your home page
                });
            }
        }
        setTimeout(() => setShowToast(false), 3000);
    };

    function getRelativeTime(previousDate: any) {
        const currentDate: any = new Date();
        const prevDate: any = new Date(previousDate);

        const timeDifference = currentDate - prevDate;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''} ago`;
        } else if (months > 0) {
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
        }
    }

    if (isLoading) {
        return <SpinnerLoading />;
    }
    return (
        <>
            <div className="container-xxl bg-dark page-header mb-5">
                <div className="container pt-5 pb-2">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">{t('header.approvedBlogs')}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb text-uppercase">
                            <li className="breadcrumb-item"><Link to="/home">{t('header.home')}</Link></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">{t('header.approvedBlogs')}</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="row mt-3 g-0">
                <div className="col-md-6">
                    <form method="POST" onSubmit={handleSubmit}>
                        <div className="col-md-12">
                            <div className="text-center mb-3" {...getImageRootProps()} >
                                <input {...getImageInputProps()} />
                                {imageURL ? (
                                    <img
                                        src={imageURL}
                                        className="img-fluid rounded-circle "
                                        alt="Uploaded"
                                        style={{ objectFit: 'cover', height: "150px", width: "150px" }}
                                    />
                                ) : (
                                    <>
                                        <img
                                            src="https://res.cloudinary.com/dzqoi9laq/image/upload/v1699419757/logoo_pyz2sp.png"
                                            className=" img-fluid rounded-circle"
                                            alt="Default"
                                            style={{ height: "150px", width: "150px" }}
                                        />
                                        {errorImg.length >0 ? (
                                            <>
                                            <p className="error-message text-danger">{errorImg}</p>
                                             <p className="error-message text-success"> {t('profile.dragOrClick')}</p>   
                                            </>
                                        ):(
                                            <p className="error-message text-success"> {t('profile.dragOrClick')}</p>   
                                        )}
                                    </>
                                )}

                            </div>
                            <div className="col-md-12">
                                <div className="mb-3 ms-2 me-2">
                                    <label htmlFor="title" className="form-label fw-bold">{t('placeholders.title')}</label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={formData.title}
                                        className="form-control"
                                        placeholder={t('placeholders.title')}
                                        onChange={handleInputChange}
                                        readOnly={view === true}
                                    />
                                    {formErrors.title && (
                                        <span className="error-message text-danger">{formErrors.title}</span>
                                    )}
                                </div>
                                <div className="mb-3 ms-2 me-2">
                                    <label htmlFor="blogContent" className="form-label fw-bold">{t('placeholders.blogContent')}</label>
                                    <ReactQuill
                                        value={EditorHtml}
                                        onChange={setEditorHtml}
                                        style={{ height: '80px' }}
                                        readOnly={view === true}
                                    />
                                    {formErrors.blogContent && (
                                        <span className="error-message text-danger">{formErrors.blogContent}</span>
                                    )}
                                </div>
                                <div className="mb-3 mt-5 ms-2 me-2">
                                    <label htmlFor="author" className="form-label fw-bold">{t('placeholders.author')}</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        className="form-control"
                                        placeholder={t('placeholders.author')}
                                        onChange={handleInputChange}
                                        readOnly={view === true}
                                    />
                                    {formErrors.author && (
                                        <span className="error-message text-danger">{formErrors.author}</span>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-12  ">
                                <div className="form-btn text-center">
                                    {view === false && (
                                        <button type="submit" className="btn btn-primary me-3">{t('btn.btnPost')}</button>
                                    )}
                                    <button type="button" onClick={cancelForm} className="btn btn-secondary">{t('btn.btnCancel')}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-md-6">
                    {blogs.length > 0 &&
                        blogs.map((blog, index) => (
                            <div key={index} className="card border-0 w-100">
                                <div className="row g-0">
                                    <div className="col-3 text-center">
                                        <img
                                            src={blog.blogImg}
                                            className="img-fluid rounded-circle"
                                            style={{ objectFit: 'cover', height: '100px', width: '100px' }}
                                            alt="..."
                                        />
                                    </div>
                                    <div className="col-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{blog.blogTitle}</h5>
                                            <p className="card-text" dangerouslySetInnerHTML={{ __html: blog.blogContent.slice(0, 200) }}></p>
                                            <div className="d-flex justify-content-between">
                                                <p className="card-text">
                                                    <small className="text-muted">{t('blog.lastUpdated')}<b>{getRelativeTime(blog.createdAt)}</b> </small>
                                                </p>
                                                <button className="btn btn-success p-1 " onClick={() => handleViewClick(blog)}>{t('btn.btnView')}</button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                    {blogs.length <= 0 && (
                        <div className="card border-0 w-100 mt-5">
                            <div className="row g-0">
                                <div className="col-3">
                                    <img src="https://res.cloudinary.com/dzqoi9laq/image/upload/v1699431277/oops-emoticon-vector-illustration-over-white-56744303_lkc83r.jpg" className="img-fluid rounded-circle" style={{ objectFit: 'contain', height: '140px', width: '150px' }} alt="..." />
                                </div>
                                <div className="col-8">
                                    <div className="card-body">
                                        <h5 className="card-title">Oops</h5>
                                        <p className="card-text">{t('blog.noBlog')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


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
            </div>
            <div className="position-fixed bottom-0 end-0 p-3 toast-message" style={{ zIndex: "999" }}>
                <div
                    className={`toast ${showToast ? "show" : ""}`}
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    <div className="toast-header" style={{ backgroundColor: '#198754', color: 'white' }}>
                        <strong className="me-auto">Post Blog Status</strong>
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
}