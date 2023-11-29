import React from 'react';
import { useTranslation } from 'react-i18next';

export const HomePageBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="container-fluid p-0">
      <div id="header-carousel" className="carousel slide header-carousel" data-bs-ride="carousel" data-bs-interval="3000">
        <ol className="carousel-indicators">
          <li data-bs-target="#header-carousel" data-bs-slide-to="0" className="active"></li>
          <li data-bs-target="#header-carousel" data-bs-slide-to="1"></li>
        </ol>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className="img-fluid" src="assets/img/carousel-1.jpg" alt="" />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: "rgba(43, 57, 64, .5)" }}>
              <div className="container">
                <div className="row justify-content-start">
                  <div className="col-10 col-lg-8">
                    <h1 className="display-3 text-white animated slideInDown mb-4">{t('home.carousel.title')}</h1>
                    <p className="fs-5 fw-medium text-white mb-4 pb-2">{t('home.carousel.description')}</p>
                    <a href="" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">{t('home.carousel.btnSearchJob')}</a>
                    <a href="" className="btn btn-secondary py-md-3 px-md-5 animated slideInRight">{t('home.carousel.btnFindTalent')}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img className="img-fluid" src="assets/img/carousel-2.jpg" alt="" />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: "rgba(43, 57, 64, .5)" }}>
              <div className="container">
                <div className="row justify-content-start">
                  <div className="col-10 col-lg-8">
                    <h1 className="display-3 text-white animated slideInDown mb-4">{t('home.carousel.title')}</h1>
                    <p className="fs-5 fw-medium text-white mb-4 pb-2">{t('home.carousel.description')}</p>
                    <a href="" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">{t('home.carousel.btnSearchJob')}</a>
                    <a href="" className="btn btn-secondary py-md-3 px-md-5 animated slideInRight">{t('home.carousel.btnFindTalent')}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
