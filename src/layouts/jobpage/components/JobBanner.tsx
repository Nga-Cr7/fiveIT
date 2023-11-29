import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
export function JobBanner() {
  const { t } = useTranslation();
  return (
    <div className="container-xxl py-5 bg-dark page-header mb-5">
      <div className="container my-5 pt-5 pb-4">
        <h1 className="display-3 text-white mb-3 animated slideInDown">{t('job.jobBanner.pageTitle')}</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb text-uppercase">
            <li className="breadcrumb-item"><Link to="/home">{t('job.jobBanner.home')}</Link></li>
            <li className="breadcrumb-item "><Link to="/jobss" className='text-white active'>{t('job.jobBanner.jobs')}</Link></li>
          </ol>
        </nav>
      </div>
    </div>
  );
}