import { Link } from "react-router-dom";
import {useTranslation} from "react-i18next"

export const About = () => {

    const { t } = useTranslation();
  return (
    <div className="container-xxl py-5">
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                        <div className="row g-0 about-bg rounded overflow-hidden">
                            <div className="col-6 text-start">
                                <img className="img-fluid w-100" src="assets/img/about-1.jpg" alt=""/>
                            </div>
                            <div className="col-6 text-start">
                                <img className="img-fluid" src="assets/img/about-2.jpg" style={{ width: "85%", marginTop: "15%" }} alt=""/>
                            </div>
                            <div className="col-6 text-end">
                                <img className="img-fluid" src="assets/img/about-3.jpg" style={{ width: "85%"}} alt=""/>
                            </div>
                            <div className="col-6 text-end">
                                <img className="img-fluid w-100" src="assets/img/about-4.jpg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                        <h1 className="mb-4">{t('home.readMore.header')}</h1>
                        <p className="mb-4">{t('home.readMore.paragraph1')}</p>
                        <p><i className="fa fa-check text-primary me-3"></i>{t('home.readMore.listItems1')}</p>
                        <p><i className="fa fa-check text-primary me-3"></i>{t('home.readMore.listItems2')}</p>
                        <p><i className="fa fa-check text-primary me-3"></i>{t('home.readMore.listItems3')}</p>
                        <Link className="btn btn-primary py-3 px-5 mt-3" to="/home">{t('home.readMore.buttonText')}</Link>
                    </div>
                </div>
            </div>
        </div>
  );
}

