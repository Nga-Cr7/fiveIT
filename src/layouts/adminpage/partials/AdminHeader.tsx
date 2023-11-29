import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvide";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';


export const AdminHeader = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const sidebarToggler = document.getElementById('sidebarToggler');
    const sidebar = document.getElementById('sidebarAdmin');
    const content= document.querySelector('.content') as HTMLElement;;

    if (sidebarToggler && sidebar && content) {
      let isSidebarOpen = false;

      const handleClick = () => {
        isSidebarOpen = !isSidebarOpen;
        sidebar.style.marginLeft = isSidebarOpen ? '0' : '-250px'; // Adjust the value as needed
        content.style.marginLeft = isSidebarOpen ? '255px' : '0'; // Adjust the value as needed
        content.style.width = isSidebarOpen ? 'calc(100% - 255px)' : '100%'; // Adjust the value as needed
      };
      sidebarToggler.addEventListener('click', handleClick);
      return () => {
        sidebarToggler.removeEventListener('click', handleClick);
      };
    }
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
        <Link to="/dashboard" className="navbar-brand d-flex d-lg-none me-4">
          <h2 className="text-primary mb-0">
          </h2>
        </Link>
        <a className="sidebar-toggler flex-shrink-0" id="sidebarToggler">
          <i className="fa fa-bars"></i>
        </a>

        <div className="navbar-nav align-items-center ms-auto">
          {user ? (
            <div className="nav-item dropdown">
              <a href="#" className="nav-link dropdown-toggle">
                <img className="rounded-circle me-lg-2" src="/logo.png" alt="" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                <span className="d-none d-lg-inline-flex">{user.name}</span>
              </a>
              <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                {/* <a href="#" className="dropdown-item">My Profile</a>
                <a href="#" className="dropdown-item">Settings</a> */}
                <button className="dropdown-item" onClick={logout}>{t('header.logout')}</button>
              </div>
            </div>
          ) : null}

        </div>
      </nav>
      
    </>
  );
};