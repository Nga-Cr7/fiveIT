import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const FooterPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
      <div className="container py-3">
        <div className="row g-5">
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">{t('footer.about')}</h5>
            <Link className="btn btn-link text-white-50" to="/about">{t('footer.aboutUs')}</Link>
            <Link className="btn btn-link text-white-50" to="/contact">{t('footer.contactUs')}</Link>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">{t('footer.quickLinks')}</h5>
            <Link className="btn btn-link text-white-50" to="">{t('footer.ourServices')}</Link>
            <Link className="btn btn-link text-white-50" to="">{t('footer.privacyPolicy')}</Link>
            <Link className="btn btn-link text-white-50" to="">{t('footer.termsCondition')}</Link>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">{t('footer.address')}</h5>
            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>{t('footer.addressText')}</p>
            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+84 234 567 890</p>
            <p className="mb-2"><i className="fa fa-envelope me-3"></i>FiveITViec@gmail.com</p>
            <div className="d-flex pt-2">
              <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-twitter"></i></Link>
              <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-facebook-f"></i></Link>
              <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-youtube"></i></Link>
              <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-linkedin-in"></i></Link>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">{t('footer.newsletter')}</h5>
            <p>{t('footer.newsletterText')}</p>
            <div className="position-relative mx-auto" style={{ maxWidth: '400px' }}>
              <input className="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="text" placeholder={t('footer.yourEmail')} />
              <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">{t('footer.signUp')}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row text-center py-3">
        <p>&copy; FiveITViec {t('footer.designBy')} <b>Mr_Nga, Mr_Bảo, Mr_Luân and Mr_Nguyên</b>. {t('footer.allRightsReserved')}</p>
      </div>
    </div>
  );
}
