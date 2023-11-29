import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import i18n from "../../../locales/i18n/i18n";
import { useAuth } from "../../utils/AuthProvide";


export const Sidebar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const location = useLocation();
  const [isCandidateDropdownClicked, setIsCandidateDropdownClicked] = useState(false);
  const [isEmployerDropdownClicked, setIsEmployerDropdownClicked] = useState(false);
  const [isContactDropdownClicked, setIsContactDropdownClicked] = useState(false);
  const [isJobDropdownClicked, setIsJobDropdownClicked] = useState(false);
  const [isBlogDropdownClicked, setIsBlogDropdownClicked] = useState(false);

  const handleEmployerDropDown = () => {
    setIsEmployerDropdownClicked(!isEmployerDropdownClicked);
  }
  const handleCandidateDropDown = () => {
    setIsCandidateDropdownClicked(!isCandidateDropdownClicked);
  }
  const handleJobDropDown = () => {
    setIsJobDropdownClicked(!isJobDropdownClicked);
  }
  const handleBlogDropDown = () => {
    setIsBlogDropdownClicked(!isBlogDropdownClicked);
  }
  const handleContactDropDown = () => {
    setIsContactDropdownClicked(!isContactDropdownClicked);
  }
  const userLanguage = localStorage.getItem('userLanguage') || 'en';

  useEffect(() => {
    i18n.changeLanguage(userLanguage);
  }, [i18n, userLanguage]);

  const changeLanguage = (language: any) => {
    i18n.changeLanguage(language);
    localStorage.setItem('userLanguage', language);
  };
  return (
    <>
      {/* Sidebar Start */}

      <div className="sidebar pe-4 pb-3" id="sidebarAdmin" style={{ backgroundColor: '#F3F6F9' }}>
        <nav className="navbar bg-light navbar-light">
          <div className="d-flex align-items-center ms-4 mb-4">
            <div className="position-relative">
              <img className="rounded-circle" src="/logo.png" alt="" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
            </div>
            <div className="ms-3">
              <h6 className="mb-0">FiveITViec</h6>
            </div>
          </div>
          <div className="navbar-nav w-100">
            <Link to="/dashboard" className={
              location.pathname === "/dashboard"
                ? "nav-item nav-link active"
                : "nav-item nav-link"}>
              <i className="fa fa-tachometer-alt me-2"></i>{t('header.dashboard')}
            </Link>
            <Link to="/candidate" className={location.pathname === "/candidate" ? "nav-item nav-link nav-link active" : "nav-item nav-link nav-link "}>
              <i className="fas fa-user-tie"></i>{t('header.candidates')}
            </Link>

            <div className="nav-item dropdown">
              <Link to="#" data-bs-toggle="dropdown" onClick={handleEmployerDropDown} className={
                location.pathname === "/employer"
                  ? "nav-link dropdown-toggle active"
                  : "nav-link dropdown-toggle"}>
                <i className="fas fa-industry"></i>{t('header.employers')}
              </Link>
              <div className="dropdown-menu dropEmployer bg-transparent border-0">
                <Link to="/employer/approvedEmployer" className={location.pathname === "/employer/approvedEmployer" ? "ms-5 p-2 nav-item nav-link active" : "ms-5 p-2 nav-item nav-link "} style={{ fontSize: '12px' }}>{t('header.approvedEmployers')}</Link>
                <Link to="/employer/waitingEmployer" className={location.pathname === "/employer/waitingEmployer" ? "ms-5 p-2 nav-item nav-link active" : "ms-5 p-2 nav-item nav-link "} style={{ fontSize: '12px' }}>{t('header.waitingEmployers')}</Link>
              </div>
            </div>

            <Link to="/category" className={location.pathname === "/category" ? "nav-item nav-link nav-link active" : "nav-item nav-link nav-link "}>
              <i className="fa fa-th me-2"></i>{t('header.category')}
            </Link>

            <div className="nav-item dropdown">
              <Link to="#" data-bs-toggle="dropdown" onClick={handleJobDropDown} className={
                location.pathname === "/job"
                  ? "nav-link dropdown-toggle active"
                  : "nav-link dropdown-toggle"}>
                <i className="fas fa-briefcase"></i>{t('header.jobs')}
              </Link>
              <div className="dropdown-menu dropJob bg-transparent border-0">
                <Link to="/job/approvedJob" className={location.pathname === "/job/approvedJob" ? "ms-5 p-2 nav-item nav-link active" : "ms-5 p-2 nav-item nav-link "} style={{ fontSize: '12px' }}>{t('header.approvedJobs')}</Link>
                <Link to="/job/waitingJob" className={location.pathname === "/job/waitingJob" ? "ms-5 p-2 nav-item nav-link active" : "ms-5 p-2 nav-item nav-link"} style={{ fontSize: '12px' }}>{t('header.waitingJobs')}</Link>
              </div>
            </div>

            <div className="nav-item dropdown">
              <Link to="#" data-bs-toggle="dropdown" onClick={handleBlogDropDown} className={
                location.pathname === "/blog"
                  ? "nav-link dropdown-toggle active"
                  : "nav-link dropdown-toggle"}>
                <i className="fas fa-address-card"></i>{t('header.blog')}
              </Link>
              <div className="dropdown-menu dropBlog bg-transparent border-0">
                <Link to="/blog/approvedBlog" className={location.pathname === "/blog/approvedBlog" ? "ms-5 p-2 nav-item nav-link active" : "ms-5 p-2 nav-item nav-link "} style={{ fontSize: '12px' }}>{t('header.approvedBlogs')}</Link>
                <Link to="/blog/waitingBlog" className={location.pathname === "/blog/waitingBlog" ? "ms-5 p-2 nav-item nav-link active" : "ms-5 p-2 nav-item nav-link"} style={{ fontSize: '12px' }}>{t('header.waitingBlogs')}</Link>
              </div>
            </div>

            <div className="nav-item dropdown">
              <Link to="#" data-bs-toggle="dropdown" onClick={handleContactDropDown} className={
                location.pathname === "/contact"
                  ? "nav-link dropdown-toggle active"
                  : "nav-link dropdown-toggle"}>
                <i className="fas fa-mail-bulk"></i>{t('header.contact')}
              </Link>
              <div className="dropdown-menu dropContact bg-transparent border-0">
                <Link to="/contact/openContact" className={location.pathname === "/contact/openContact" ? "ms-5 p-2 nav-item nav-link active" : "ms-5 p-2 nav-item nav-link "} style={{ fontSize: '12px' }}>{t('header.openContact')}</Link>
                <Link to="/contact/closeContact" className={location.pathname === "/contact/closeContact" ? "ms-5 p-2 nav-item nav-link active" : "ms-5 p-2 nav-item nav-link"} style={{ fontSize: '12px' }}>{t('header.closeContact')}</Link>
              </div>
            </div>
            <div className="nav-item dropdown">
              <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                <i className="fas fa-language"></i>{t('header.languages')}
              </Link>
              <div className="dropdown-menu bg-transparent border-0">
                <button onClick={() => changeLanguage('en')} className="dropdown-item">
                  English
                </button>
                <button onClick={() => changeLanguage('vi')} className="dropdown-item">
                  Tiếng Việt
                </button>
              </div>
            </div>
            
            <button  onClick={logout} className="nav-item nav-link nav-link border-0">
              <i className="fas fa-home me-2"></i>{t('header.logout')}
            </button>

          </div>
        </nav >
      </div >


      {isEmployerDropdownClicked ? (
        <style>
          {`
            .navbar .nav-item .dropEmployer{
              display:block;
              opacity:1 !important;
              visibility: visible !important;
              transform:none !important;
            }

            .navbar .nav-item:hover .dropEmployer{
              transform:none !important;
            }

        `}

        </style>
      ) : (
        <style>
          {`
            .navbar .nav-item .dropEmployer{
              display:none;
              opacity:1 !important;
              visibility: visible !important;
              transform:none !important;
            }
            .navbar .nav-item:hover .dropEmployer{
              transform:none !important;
            }
        `}

        </style>
      )}
      {isCandidateDropdownClicked ? (
        <style>
          {`
            .navbar .nav-item .dropCandidate{
              display:block;
              opacity:1 !important;
              visibility: visible !important;
              transform:none !important;
            }

            .navbar .nav-item:hover .dropCandidate{
              transform:none !important;
            }

        `}

        </style>
      ) : (
        <style>
          {`
            .navbar .nav-item .dropCandidate{
              display:none;
              opacity:1 !important;
              visibility: visible !important;
              transform:none !important;
            }
            .navbar .nav-item:hover .dropCandidate{
              transform:none !important;
            }
        `}

        </style>
      )}
      {isJobDropdownClicked ? (
        <style>
          {`
            .navbar .nav-item .dropJob{
              display:block;
              opacity:1 !important;
              visibility: visible !important;
              transform:none !important;
            }

            .navbar .nav-item:hover .dropJob{
              transform:none !important;
            }

        `}

        </style>
      ) : (
        <style>
          {`
            .navbar .nav-item .dropJob{
              display:none;
              opacity:1 !important;
              visibility: visible !important;
              transform:none !important;
            }
            .navbar .nav-item:hover .dropJob{
              transform:none !important;
            }
        `}

        </style>
      )}
      {isBlogDropdownClicked ? (
        <style>
          {`
            .navbar .nav-item .dropBlog{
              display:block;
              opacity:1 !important;
              visibility: visible !important;
              transform:none !important;
            }

            .navbar .nav-item:hover .dropBlog{
              transform:none !important;
            }

        `}

        </style>
      ) : (
        <style>
          {`
            .navbar .nav-item .dropBlog{
              display:none;
              opacity:1 !important;
              visibility: visible !important;
              transform:none !important;
            }
            .navbar .nav-item:hover .dropBlog{
              transform:none !important;
            }
        `}

        </style>
      )}

      {isContactDropdownClicked ? (
        <style>
          {`
            .navbar .nav-item .dropContact{
              display:block;
              opacity:1 !important;
              visibility: visible !important;
              transform:none !important;
            }

            .navbar .nav-item:hover .dropContact{
              transform:none !important;
            }

        `}

        </style>
      ) : (
        <style>
          {`
            .navbar .nav-item .dropContact{
              display:none;
              opacity:1 !important;
              visibility: visible !important;
              transform:none !important;
            }
            .navbar .nav-item:hover .dropContact{
              transform:none !important;
            }
        `}

        </style>
      )}

      {/* Chinh hover: 28554 */}

    </>
  );
};
