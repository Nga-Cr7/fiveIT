import { Link } from "react-router-dom";
import styles from './../css/blog.module.css';
import clsx from "clsx";
import { useTranslation } from 'react-i18next';
export const BlogBanner = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.breadcrumbss}>
        <div className={clsx(styles.pageHeaderr, "d-flex align-items-center")}  >
          <div className={clsx(styles.containerr, "position-relative")}>
            <div className="row d-flex justify-content-center">
              <div className="col-lg-6 text-center">
                <h2>Blog</h2>
                <p>{t('blog.blogBanner.description')}</p>
              </div>
            </div>
          </div>
        </div>
        <nav>
          <div className={styles.containerr}>
            <ol>
              <li><Link to="/home">{t('blog.blogBanner.home')}</Link></li>
              <li>Blog</li>
            </ol>
          </div>
        </nav>
      </div>
    </>
  );
}