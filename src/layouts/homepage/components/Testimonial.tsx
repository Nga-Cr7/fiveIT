import React from 'react';
import { useTranslation } from 'react-i18next';

export const Testimonial = () => {
    const { t } = useTranslation();

    return (
        <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
            <div className="container">
                <h1 className="text-center mb-5">{t('home.testimonial.clientsSay')}</h1>
                <div className="d-md-flex justify-content-between">
                    <div className="testimonial-item bg-light rounded p-4 mb-4">
                        <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                        <p style={{ height: '100px', overflow: 'hidden' }}>{t('home.testimonial.client1')}</p>
                        <div className="d-flex align-items-center">
                            <img
                                className="img-fluid flex-shrink-0 rounded"
                                src="assets/img/testimonial-1.jpg"
                                style={{ width: '50px', height: '50px' }}
                                alt=""
                            />
                            <div className="ps-3">
                                <h5 className="mb-1">Mr Bảo</h5>
                                <small>{t('home.testimonial.profession')}</small>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-item bg-light rounded p-4 mb-4">
                        <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                        <p style={{ height: '100px', overflow: 'hidden' }}>{t('home.testimonial.client2')}</p>
                        <div className="d-flex align-items-center">
                            <img
                                className="img-fluid flex-shrink-0 rounded"
                                src="./assets/img/testimonial-2.jpg"
                                style={{ width: '50px', height: '50px' }}
                                alt=""
                            />
                            <div className="ps-3">
                                <h5 className="mb-1">Mr Luân</h5>
                                <small>{t('home.testimonial.profession')}</small>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-item bg-light rounded p-4 mb-4">
                        <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                        <p style={{ height: '100px', overflow: 'hidden' }}>{t('home.testimonial.client3')}</p>
                        <div className="d-flex align-items-center">
                            <img
                                className="img-fluid flex-shrink-0 rounded"
                                src="assets/img/testimonial-3.jpg"
                                style={{ width: '50px', height: '50px' }}
                                alt=""
                            />
                            <div className="ps-3">
                                <h5 className="mb-1">Mr Nguyên</h5>
                                <small>{t('home.testimonial.profession')}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
