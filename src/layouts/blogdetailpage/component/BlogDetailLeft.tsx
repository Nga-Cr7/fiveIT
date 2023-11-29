import { Link } from "react-router-dom";
import { BlogModel } from "../../../models/BlogModel";
import styles from "../css/blog.module.css"
import { useTranslation } from 'react-i18next';

export const BlogDetailLeft: React.FC<{ blog?: BlogModel }> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <article className={styles.blogDetails}>
        <div className={styles.postImg}>

          <img src={props.blog?.blogImg} alt="IMG" className="img-fluid" />
        </div>

        <h2 className={styles.titlee}>
          {props.blog?.blogTitle}
        </h2>

        <div className={styles.metaTop}>
          <ul>
            <li className="d-flex align-items-center mt-2">
              <i className="bi bi-person me-2"></i>{" "}
              <Link to="/blog">{props.blog?.author}</Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="bi bi-clock me-2"></i>{" "}
              <Link to="/blog">
                <time dateTime="2020-01-01">{props.blog?.createdAt}</time>
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="bi bi-chat-dots me-2"></i>{" "}
              <a href="/blog">12 Comments</a>
            </li>
          </ul>
        </div>

        <div className={styles.content}>
          <p>
            {props.blog?.blogContent}
          </p>

          <blockquote>
            <p>
              {t('blogDetail.left.qoute')}
            </p>
          </blockquote>

          <p>
            {t('blogDetail.left.point1')}
          </p>
          <h3>
            {t('blogDetail.left.point2')}
          </h3>
          <p>
            {t('blogDetail.left.point3')}
          </p>
          <h3> {t('blogDetail.left.point4')}</h3>
          <p>
            {t('blogDetail.left.point5')}
          </p>
          <p>
            {t('blogDetail.left.point6')}
          </p>
        </div>
      </article>
    </>
  );
};
