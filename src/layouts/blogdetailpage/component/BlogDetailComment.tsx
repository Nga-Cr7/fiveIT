import styles from "../css/blog.module.css"
import { TextEditorReactQuill } from "../../utils/TextEditorReactQuill";
import { FaStar } from "react-icons/fa";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { useAuth } from "../../utils/AuthProvide";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pagination } from "../../utils/Pagination";
import { BlogComment } from "../../../models/BlogComment";
import { BlogModel } from "../../../models/BlogModel";
import { UserModel } from "../../../models/UserModel";

import { useTranslation } from 'react-i18next';

export const BlogDetailComment: React.FC<{ blog?: BlogModel }> = (props) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [avgRating, setAvgRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);
  const [postCmt, setPostCmt] = useState(false);
  const blogId = props.blog?.blogId;

  const [rating, setRating] = useState(0);
  const [editorHtml, setEditorHtml] = useState('');
  const [formData, setFormData] = useState({ review_text: '' });

  // Handle pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(4);
  const [totalAmountOfRv, setTotalAmountOfRv] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [reviewAndRating, setReviewAndRating] = useState<BlogComment[]>([]);

  useEffect(() => {
    const fetchBlogComment = async () => {
      const baseUrlForRv = `http://localhost:8080/api/blogComments/search/findCommentByBlogId?blogId=${blogId}&page=${currentPage - 1
        }&size=${blogsPerPage}`;

      const totalRvUrl = `http://localhost:8080/api/blogComments/search/findCommentByBlogId?blogId=${blogId}`;

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
          reviewAndRatingTotalData._embedded.blogComments;
        let count = 0;
        for (const key in reviewAndRatinTotalgDataResponse) {
          count = count + reviewAndRatinTotalgDataResponse[key].rating;
        }
        setTotalRating(count);



        const reviewAndRatingDataResponse =
          reviewAndRatingData._embedded.blogComments;


        setTotalAmountOfRv(reviewAndRatingData.page.totalElements);
        setTotalPage(reviewAndRatingData.page.totalPages);

        const loadedReviewAndRatingModels: BlogComment[] = [];

        for (const key in reviewAndRatingDataResponse) {
          const userInRvResponse = await fetch(
            reviewAndRatingDataResponse[key]._links.user.href
          );

          const blogInRvResponse = await fetch(
            reviewAndRatingDataResponse[key]._links.blog.href
          );


          const userInRvDataResponse = await userInRvResponse.json();
          const blogInRvDataResponse = await blogInRvResponse.json();

          const userForRv: UserModel = {
            userId: userInRvDataResponse.userId,
            userName: userInRvDataResponse.userName,
            phoneNumber: userInRvDataResponse.phoneNumber,
            email: userInRvDataResponse.email,
            status: userInRvDataResponse.status,
          };

          const jobForRvCate = await fetch(
            reviewAndRatingDataResponse[key]._links.blog.href
          );

          if (!jobForRvCate.ok) {
            throw new Error("Something went wrong with one of the requests");
          }


          const blogForRvUser = await fetch(
            reviewAndRatingDataResponse[key]._links.user.href
          );
          if (!blogForRvUser.ok) {
            throw new Error("Something went wrong with one of the requests");
          }
          const jobForRvUserResponse = await blogForRvUser.json();

          const jobCreatorId = jobForRvUserResponse.userId;



          const blogForRv: any = {
            blogId: blogInRvDataResponse.blogId,
            blogTitle: blogInRvDataResponse.blogTitle,
            blogContent: blogInRvDataResponse.blogContent,
            blogImg: blogInRvDataResponse.blogImg,
            author: blogInRvDataResponse.author,
            status: blogInRvDataResponse.status,
            createdAt: blogInRvDataResponse.createdAt,
          };
          console.log("Blog for review", blogForRv)

          const reviewAndRating = new BlogComment(
            reviewAndRatingDataResponse[key].commentId,
            blogForRv,
            userForRv,
            reviewAndRatingDataResponse[key].rating,
            reviewAndRatingDataResponse[key].commentText,
            reviewAndRatingDataResponse[key].createdAt
          );
          loadedReviewAndRatingModels.push(reviewAndRating);

        }
        setReviewAndRating(loadedReviewAndRatingModels);
        console.log("List BloComment", loadedReviewAndRatingModels)
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

    fetchBlogComment();
  }, [currentPage, totalRating, postCmt]);

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const location = useLocation();
  const handleToastClick = () => {
    const currentPath = location.pathname;
    localStorage.setItem('redirectToPage', currentPath);
    navigate('/login');
  };
  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    if (message === t('showToastMessage.pleaseLogin')) {
      const toastMessage = document.querySelector('.toast-message');
        if (toastMessage) {
          // console.log("aaaa")
          toastMessage.addEventListener('click', handleToastClick);
      }
    }
    setTimeout(() => {
      setShowToast(false);
      if (message === t('showToastMessage.pleaseLogin')) {
        const toastMessage = document.querySelector('.toast-message');
        if (toastMessage) {
          toastMessage.removeEventListener('click', handleToastClick);
        }
      }
    }, 3000);
  };

  const token: any = localStorage.getItem("jwt_token");


  // submit form post comment here
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.review_text = editorHtml;
    if (user === null) {
      showToastMessage(t('showToastMessage.pleaseLogin'));
      return;
    }
    if (formData.review_text.trim().length === 0) {
      showToastMessage(t('showToastMessage.reviewContent'));
      return;
    }

    if (rating === 0) {
      showToastMessage(t('showToastMessage.reviewRating'));
      return;
    }

    if (!(formData.review_text.trim().length === 0) && rating !== 0) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8080/auth/postBlogComment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            blogId: blogId,
            rating: rating,
            blogComment: formData.review_text,
          }),
        });

        if (response.ok) {
          setIsLoading(false);
          setPostCmt(true);
          setFormData({ review_text: "" });
          setEditorHtml("");
          setRating(0);
          showToastMessage(t('showToastMessage.thanksForComment'));
        } else {
          setIsLoading(false);
        }
      } catch (error: any) {
        console.log("Error fetching API:", error);
        setIsLoading(false);
      }
    }

  };

  if (isLoading) {
    return <SpinnerLoading />;
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <>

      <div className="mt-5">
        <h3>{t('comment.review_rating')}</h3>

        {/* Thống kê số sao và số comment */}
        <div className="row mt-4">
          <div className="col-md-6">
            <h4>{t('comment.statistic')}</h4>
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
              <p>{t('comment.no_review')}</p>
            )}
          </div>
          <div className="col-md-6">
            <h4>{t('comment.comments')}</h4>
            <h5>{totalAmountOfRv} {t('comment.comments')}</h5>
          </div>
        </div>

        {/* Hiển thị các comment */}
        <div className="mt-4">
          {reviewAndRating.length > 0 && reviewAndRating.map((reviewAndRating, index) => (
            <>
              <div className={styles.comments} key={index}>
                <div id="comment" className={styles.comment}>
                  <div className="d-flex">
                    <div className={styles.commentImg}>
                      <img src="assets/img/blog/comments-1.jpg" alt="" />
                    </div>
                    <div>
                      <h5>
                        <Link to="#" style={{ color: "black" }}>
                          {reviewAndRating.user.email}
                        </Link>{" "}
                        <Link to="#"
                          className={styles.reply}
                          style={{ paddingLeft: "10px" }}
                        >
                          <i className="bi bi-reply-fill"></i> Reply
                        </Link>
                      </h5>
                      <time dateTime="2020-01-01">{reviewAndRating.createdAt}</time>
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
                      <p key={`reviewText_${index}`} dangerouslySetInnerHTML={{ __html: reviewAndRating.commentText }}></p>
                    </div>
                  </div>
                </div>
                <br />
              </div>
              <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                paginate={paginate}
              />
            </>
          ))}



        </div>

        {/* Form post comment */}
        <div className="">
          <h4 className="fw-bold mb-3">{t('comment.review')}</h4>
          <form method="POST" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="">{t('comment.ratings')}</label> <br />
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
              {t('comment.content')}
              </label>
              <TextEditorReactQuill
                value={editorHtml}
                onChange={setEditorHtml}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
            {t('btn.btnSend')}
            </button>
          </form>
        </div>
        <div className="position-fixed top-0 end-0 p-3 toast-message" style={{ zIndex: 5 }}>
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
      </div>
    </>
  );
};
