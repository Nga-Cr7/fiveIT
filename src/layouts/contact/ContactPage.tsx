import React, { useState } from "react";
import { useAuth } from '../utils/AuthProvide';
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

localStorage.removeItem("catee");

interface FormData {
    email: string;
    name: string;
    subject: string;
    message: string;

}
export const ContactPage = () => {
    localStorage.removeItem("jobCate");
    const { t } = useTranslation()
    const { user } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        email: "",
        name: "",
        subject: "",
        message: "",
    });

    const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let errors: Partial<FormData> = {};
        let isValid = true;

        if (!formData.email.trim()) {
            errors.email = t("formErrors.emailRequired");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = t("formErrors.emailInvalid");
            isValid = false;
        }

        if (formData.name.trim().length < 3) {
            errors.name = t("formErrors.nameLength");
            isValid = false;
        }
        if (formData.subject.trim().length < 10) {
            errors.subject = t("formErrors.subjectLength");
            isValid = false;
        }
        if (formData.message.trim().length < 20) {
            errors.message = t("formErrors.messageLength");
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");

    const showToastMessage = (message: string) => {
        setMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = validateForm();


        if (isValid) {
            setIsLoading(true);
            setTimeout(async () => {
                try {
                    const response = await fetch("http://localhost:8080/contact", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`, // Add the token here
                        },
                        body: JSON.stringify({
                            name: formData.name,
                            email: formData.email,
                            subject: formData.subject,
                            message: formData.message,
                            status: 'OPEN',
                        }),
                    });

                    if (response.ok) {
                        setIsLoading(false);
                        showToastMessage(t("showToastMessage.successContactMessage"));
                        setFormData({
                            email: "",
                            name: "",
                            subject: "",
                            message: "",
                        });
                    } else {
                        setIsLoading(false);
                        showToastMessage(t("showToastMessage.errorContactMessage"));

                    }
                } catch (error) {
                    // Handle network error
                } finally {
                    setIsLoading(false);
                }
            }, 1000);

        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    if (isLoading) {
        return (
            <SpinnerLoading />
        );
    }


    return (
        <>
            <div className="container-xxl py-5 bg-dark page-header mb-5">
                <div className="container my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">{t('contact.pageTitle')}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb text-uppercase">
                            <li className="breadcrumb-item"><Link to="/home">{t('contact.breadcrumbHome')}</Link></li>
                            <li className="breadcrumb-item text-white active" aria-current="page"><Link to="/contact">{t('contact.breadcrumbContact')}</Link></li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container-xxl py-5">
                <div className="container">
                    <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">{t('contact.pageTitle')}</h1>
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="row gy-4">
                                <div className="col-md-4 wow fadeIn" data-wow-delay="0.1s">
                                    <div className="d-flex align-items-center bg-light rounded p-4">
                                        <div className="bg-white border rounded d-flex flex-shrink-0 align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px' }}>
                                            <i className="fa fa-map-marker-alt text-primary"></i>
                                        </div>
                                        <span>{t('contact.location')}</span>
                                    </div>
                                </div>
                                <div className="col-md-4 wow fadeIn" data-wow-delay="0.3s">
                                    <div className="d-flex align-items-center bg-light rounded p-4">
                                        <div className="bg-white border rounded d-flex flex-shrink-0 align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px' }}>
                                            <i className="fa fa-envelope-open text-primary"></i>
                                        </div>
                                        <span>{t('contact.email')}</span>
                                    </div>
                                </div>
                                <div className="col-md-4 wow fadeIn" data-wow-delay="0.5s">
                                    <div className="d-flex align-items-center bg-light rounded p-4">
                                        <div className="bg-white border rounded d-flex flex-shrink-0 align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px' }}>
                                            <i className="fa fa-phone-alt text-primary"></i>
                                        </div>
                                        <span>{t('contact.phone')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                            <iframe className="position-relative rounded w-100 h-100" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4435924064596!2d106.62525347355304!3d10.853826357764321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bee0b0ef9e5%3A0x5b4da59e47aa97a8!2zQ8O0bmcgVmnDqm4gUGjhuqduIE3hu4FtIFF1YW5nIFRydW5n!5e0!3m2!1svi!2s!4v1700108553650!5m2!1svi!2s"
                             frameBorder="0" style={{ minHeight: '400px', border: '0' }} aria-hidden="false"></iframe>
                        </div>
                        <div className="col-md-6">
                            <div className="wow fadeInUp" data-wow-delay="0.5s">
                                <p className="mb-4">{t('contact.formInstructions')} <a href="https://htmlcodex.com/contact-form">{t('contact.downloadLink')}</a>.</p>
                                <form method="POST" onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    placeholder={t('placeholders.name')}
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    name="name"
                                                />
                                                <label htmlFor="name">{t('placeholders.name')} <span className="error-message text-danger">{formErrors.name}</span></label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder={t('placeholders.email')}
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    name="email"
                                                />
                                                <label htmlFor="email">{t('placeholders.email')} <span className="error-message text-danger">{formErrors.email}</span></label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="subject"
                                                    placeholder={t('placeholders.subject')}
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                    name="subject"
                                                />
                                                <label htmlFor="subject">{t('placeholders.subject')} <span className="error-message text-danger">{formErrors.subject}</span></label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <textarea
                                                    className="form-control"
                                                    placeholder={t('placeholders.message')}
                                                    id="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    name="message"
                                                ></textarea>
                                                <label htmlFor="message">{t('placeholders.message')} <span className="error-message text-danger">{formErrors.message}</span></label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary w-100 py-3" type="submit">{t('contact.sendButton')}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
                <div className={`toast ${showToast ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">{t('showToastMessage.status')}</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" onClick={() => setShowToast(false)}></button>
                    </div>
                    <div className="toast-body">
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
}

