import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export const AboutPage = () => {
    const { t } = useTranslation();

    localStorage.removeItem("jobCate");

    return (
        <>
            <div className="container-xxl py-5 bg-dark page-header mb-5">
                <div className="container my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">{t('header.about')}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb text-uppercase">
                            <li className="breadcrumb-item"><Link to="/home">{t('header.home')}</Link></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">{t('header.about')}</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                            <div className="row g-0 about-bg rounded overflow-hidden">
                                <div className="col-6 text-start">
                                    <img className="img-fluid w-100" src="assets/img/about-1.jpg" alt="" />
                                </div>
                                <div className="col-6 text-start">
                                    <img className="img-fluid" src="assets/img/about-2.jpg" style={{ width: "85%", marginTop: "15%" }} alt="" />
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid" src="assets/img/about-3.jpg" style={{ width: "85%" }} alt="" />
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid w-100" src="assets/img/about-4.jpg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                            <h1 className="mb-4">{t('about.title')}</h1>
                            <p className="mb-4">{t('about.description')}</p>
                            <p><i className="fa fa-check text-primary me-3"></i>{t('about.point1')}</p>
                            <p><i className="fa fa-check text-primary me-3"></i>{t('about.point2')}</p>
                            <p><i className="fa fa-check text-primary me-3"></i>{t('about.point3')}</p>
                            <a className="btn btn-primary py-3 px-5 mt-3" href="">{t('about.readMore')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
