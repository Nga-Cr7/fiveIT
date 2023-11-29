import { Link } from "react-router-dom";
import { BlogModel } from "../../../models/BlogModel";
import styles from './../css/blog.module.css';
import clsx from "clsx";

export const Blog: React.FC<{ blog: BlogModel }> = (props) => {

  const generateRandomString = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*()_+';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const blogId = props.blog.blogId;
  const randomString = generateRandomString(50);

  const blogDetailLink = `/blogDetail/${randomString}-${blogId}-${randomString}`;

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
    return `${year}-${month}-${day}`;
  }

  return (
    <>
      <Link to={blogDetailLink} className="col-xl-4 col-md-6">
        <article className={styles.article}>
          <div className={styles.postImg}>
            <img
              src={props.blog.blogImg}
              alt=""
              className="img-fluid"
              style={{ objectFit: 'cover' }}

            />

          </div>
          <p className={styles.postCategoryy}> {props.blog.blogTitle}</p>
          <h5 className="fs-5 overflow-hidden">
            <Link to={blogDetailLink}>
              <div dangerouslySetInnerHTML={{ __html: props.blog.blogContent }} />
            </Link>

          </h5>
          <div className="d-flex align-items-center">

            <div className="post-meta">
              <p className={styles.postAuthorListt}>{props.blog.author}</p>
              <p className={styles.postDate}>
                <time dateTime={props.blog.createdAt}>{formatDateTime(props.blog.createdAt)}</time>
              </p>
            </div>
          </div>
        </article>

      </Link>
    </>
  );
};
