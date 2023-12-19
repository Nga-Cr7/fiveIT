import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../utils/AuthProvide";
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import i18n from "../../locales/i18n/i18n";
import { useEffect } from "react";


export function HeaderPage() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const userLanguage = localStorage.getItem('userLanguage') || 'en';

  useEffect(() => {
    i18n.changeLanguage(userLanguage);
  }, [i18n, userLanguage]);

  const changeLanguage = (language: any) => {
    i18n.changeLanguage(language);
    localStorage.setItem('userLanguage', language);
  };



  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <Link
        to="/"
        className="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5"
      >
        <img src="/logo.png" alt="" style={{ height: "100%" }} />
      </Link>
      <button
        type="button"
        className="navbar-toggler me-4"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto p-4 p-lg-0">

          {(user === null || (user?.role === "candidate")) && (
            <>
              <NavLink to="/home" className="nav-item nav-link">
                {t('header.home')}
              </NavLink>
              <NavLink to="/about" className="nav-item nav-link">
                {t('header.about')}
              </NavLink>
              <NavLink to="/jobs" className="nav-item nav-link">
                {t('header.jobs')}
              </NavLink>
              <NavLink to="/company" className="nav-item nav-link">
                {t('header.company')}
              </NavLink>
              <NavLink to="/blogs" className="nav-item nav-link">
                {t('header.blog')}
              </NavLink>
              <NavLink to="/contact" className="nav-item nav-link">
                {t('header.contact')}
              </NavLink>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <NavLink to="/employerDashboard" className="nav-item nav-link">
                {t('header.dashboard')}
              </NavLink>
              <NavDropdown title={t('header.blog')} id="collapsible-nav-dropdown">
                <NavLink to="/approvedEmployerBlogs" className="dropdown-item">
                  {t('header.approvedBlogs')}
                </NavLink>
                <NavLink to="/waitingEmployerBlogs" className="dropdown-item">
                  {t('header.waitingBlogs')}
                </NavLink>
              </NavDropdown>
              <NavLink to="/jobEmployerManagement" className="nav-item nav-link">
                {t('header.jobManagement')}
              </NavLink>
              <NavLink to="/profileEmployer" className="nav-item nav-link">
                {t('header.profile')}
              </NavLink>
            </>
          )}

          <NavDropdown title={t('header.languages')} id="collasible-nav-dropdown">
            <button onClick={() => changeLanguage('en')} className="dropdown-item">
              English
            </button>
            <button onClick={() => changeLanguage('vi')} className="dropdown-item">
              Tiếng Việt
            </button>
          </NavDropdown>



          {user ? (
            <div className="nav-item dropdown ">
              <h3
                className="btn nav-link dropdown-toggle text-success"
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.name}
              </h3>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuLink"
              >
                {user?.role === "candidate" && (
                  <>
                    <li>
                      <NavLink to="/profile" className="dropdown-item">
                        {t('header.profile')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/favoriteJob" className="dropdown-item">
                        {t('header.favoriteJob')}
                      </NavLink>
                    </li>
                  </>
                )}
                {user?.role === "employer" && (
                  <>
                    <li>
                      <NavLink to="/profileEmployer" className="dropdown-item">
                        {t('header.profile')}
                      </NavLink>
                    </li>
                  </>
                )}

                <li>
                  <button className="dropdown-item" onClick={logout}>
                    {t('header.logout')}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <NavLink to="/login" className="nav-item nav-link">
              {t('header.login')}
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
