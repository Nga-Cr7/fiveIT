import styles from "../css/blog.module.css"
import clsx from "clsx"
import { useTranslation } from 'react-i18next';

export const BlogDetailBanner = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.breadcrumbss}>
        <div className={clsx(styles.pageHeaderr, "d-flex align-items-center")}>
          <div className="container position-relative">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-6 text-center">
                <h2>{t('blogDetail.title')}</h2>
                <p>{t('blogDetail.description')}</p>
              </div>
            </div>
          </div>
        </div>
        <nav>
          <div className="container">
            <ol>
              <li><a href="index.html">{t('blogDetail.home')}</a></li>
              <li>{t('blogDetail.title')}</li>
            </ol>
          </div>
        </nav>
      </div>
    </>
  );
}