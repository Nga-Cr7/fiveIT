import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
export const JobDetailBanner = ()=>{
    const { t } = useTranslation();
    return (
        <div className="container-xxl py-5 bg-dark page-header mb-5">
        <div className="container my-5 pt-5 pb-4">
            <h1 className="display-3 text-white mb-3 animated slideInDown">{t('jobDetail.jobDetailBanner.pageTitle')}</h1>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb text-uppercase">
                    <li className="breadcrumb-item"><Link to="/home">{t('jobDetail.jobDetailBanner.home')}</Link></li>
                    <li className="breadcrumb-item"><Link to="/jobs">{t('jobDetail.jobDetailBanner.jobs')}</Link></li>
                    <li className="breadcrumb-item text-white active" aria-current="page">{t('jobDetail.jobDetailBanner.jobDetail')}</li>
                </ol>
            </nav>
        </div>
    </div>
    );
}