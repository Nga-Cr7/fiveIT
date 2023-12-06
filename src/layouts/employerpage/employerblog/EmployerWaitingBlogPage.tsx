import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../../utils/AuthProvide";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import ReactQuill from "react-quill";
import { Pagination } from "../../utils/Pagination";
import { BlogModel } from "../../../models/BlogModel";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export const EmployerWaitingBlogPage = () => {
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
    const [updatedBlog, setUpdatedBlog] = useState(false);
    const [updateClick, setUpdateClick] = useState(false);

    const fetchAllContacts = async () => {
        const token = localStorage.getItem("jwt_token");
        try {
            const baseUrlForBlog = `http://localhost:8080/auth/employer/getBlogsEmployer?status=DISABLE&approval=WAITING&page=${currentPage - 1}&size=${blogsPerPage}`;


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
                if (updatedBlog) {
                    setCurrentPage(1);
                    setUpdatedBlog(false);
                }

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
    }, [currentPage, updatedBlog]);



    const today = new Date().toISOString().split('T')[0]
    //form data

    interface FormData {
        blogId: string,
        title: string;
        blogContent: string;
        file: File | null | string;
        author: string;
    }

    const [formData, setFormData] = useState<FormData>({
        blogId: "",
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
                setFormData({ ...formData, ["file"]: null });
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
        if (EditorHtml.trim().length < 30) {
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
        const isValid = validateForm();
        if (isValid) {
            setIsLoading(true);
            if (formData.file) {
                formDataPost.append("file", formData.file)
            }
            formDataPost.append("blogTitle", formData.title)
            formDataPost.append("blogId", formData.blogId)
            formDataPost.append("blogContent", EditorHtml)
            formDataPost.append("author", formData.author)
            setTimeout(async () => {
                try {
                    const response = await fetch("http://localhost:8080/auth/employer/updateBlogEmployer", {
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
                            blogId: "",
                            title: "",
                            file: null,
                            blogContent: "",
                            author: "",
                        });
                        setEditorHtml("");
                        setImageURL("");
                        setUpdatedBlog(true);
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
        setFormData({
            blogId: "",
            title: " ",
            file: null,
            blogContent: "",
            author: "",
        });
        setEditorHtml("");
        setImageURL("")
        setUpdateClick(false);
    }


    const handleUpdateClick = (blog: BlogModel) => {
        setFormData({
            blogId: blog.blogId.toString(),
            title: blog.blogTitle,
            file: null || null || blog?.blogImg || logoFiveIT,
            blogContent: blog.blogContent,
            author: blog.author,
        });
        setEditorHtml(blog.blogContent);
        setImageURL(blog.blogImg);
        setUpdateClick(true);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    // loading and toast


    const showToastMessage = (message: string) => {
        setMessage(message);
        setShowToast(true);
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
                    <h1 className="display-3 text-white mb-3 animated slideInDown">{t('header.waitingBlogs')}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb text-uppercase">
                            <li className="breadcrumb-item"><Link to="/home">{t('header.home')}</Link></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">{t('header.waitingBlogs')}</li>
                        </ol>
                    </nav>
                </div>
            </div>
            {blogs.length > 0 ? (
                <>
                    <div className="row mt-3 g-0">
                        <div className="col-md-6">
                            {updateClick ? (
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
                                                    {errorImg.length > 0 ? (
                                                        <>
                                                            <p className="error-message text-danger">{errorImg}</p>
                                                            <p className="error-message text-success">{t('profile.dragOrClick')}</p>
                                                        </>
                                                    ) : (
                                                        <p className="error-message text-success">{t('profile.dragOrClick')}</p>
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
                                                />
                                                {formErrors.author && (
                                                    <span className="error-message text-danger">{formErrors.author}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-12  ">
                                            <div className="form-btn text-center">
                                                <button type="submit" className="btn btn-primary me-3">{t('btn.btnUpdate')}</button>
                                                <button type="button" onClick={cancelForm} className="btn btn-secondary">{t('btn.btnCancel')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="h-100 w-100 d-flex justify-content-center align-items-center" style={{ maxHeight: '700px' }}>
                                    <img
                                        src="https://res.cloudinary.com/dzqoi9laq/image/upload/v1699442426/pexels-ivan-samkov-4240497_piqzam.jpg"
                                        className="h-100 w-100"
                                        style={{ objectFit: "cover" }}
                                        alt=""
                                    />
                                </div>
                            )}

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
                                                    <p className="card-text" dangerouslySetInnerHTML={{ __html: blog.blogContent.slice(0, 150) }}></p>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="card-text">
                                                            <small className="text-muted">{t('blog.lastUpdated')} <b>{getRelativeTime(blog.createdAt)}</b> </small>
                                                        </p>
                                                        <button className="btn btn-primary px-3 " onClick={() => handleUpdateClick(blog)}>{t('btn.btnEdit')}</button>
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
                </>
            ) : (
                <>
                    <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="container text-center">
                            <div className="row justify-content-center">
                                <div className="col-lg-6">
                                    <i className="bi bi-exclamation-triangle display-1 text-primary"></i>
                                    <h4 className="display-1">{t('blog.empty')}</h4>
                                    <h6 className="mb-4">{t('blog.emptyBlogList')}</h6>
                                    <p className="mb-4">{t('blog.createBlog')}</p>
                                    <Link className="btn btn-primary py-3 px-5" to="/approvedEmployerBlogs">{t('btn.goToCreateBlog')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}