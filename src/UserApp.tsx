import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AboutPage } from "./layouts/about/AboutPage";
import { LoginPage } from "./layouts/authpage/LoginPage";
import { RegisterForCandidate } from "./layouts/authpage/RegisterForCandidate";
import { RegisterForEmployer } from "./layouts/authpage/RegisterForEmployer";
import { BlogDetailPage } from "./layouts/blogdetailpage/BlogDetailPage";
import { BlogPage } from "./layouts/blogpage/BlogPage";
import { CompanyDetailPage } from "./layouts/company/CompanyDetailPage";
import { CompanyPage } from "./layouts/companypage/CompanyPage";
import { ContactPage } from "./layouts/contact/ContactPage";
import { Page404 } from "./layouts/errors/Page404";
import { FavoritePage } from "./layouts/favoritepage/FavoritePage";
import { FooterPage } from "./layouts/fragment/FooterPage";
import { HeaderPage } from "./layouts/fragment/HeaderPage";
import { HomePage } from "./layouts/homepage/HomePage";
import { JobDetailPage } from "./layouts/jobdetailpage/JobDetailPage";
import { JobPage } from "./layouts/jobpage/JobPage";
import { ProfileCandidatePage } from "./layouts/profileCandidate/ProfileCandidatePage";
import { useAuth } from "./layouts/utils/AuthProvide";
import { BackToTopButton } from "./layouts/utils/BackToTopButton";

function UserApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useAuth();
  useEffect(() => {
    localStorage.removeItem("catee");
    const token = localStorage.getItem("jwt_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  return (
    <>
      <div className="container-xxl bg-white p-0">
        <HeaderPage />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/jobs" element={<JobPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/companyDetail/:companyName" element={<CompanyDetailPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/jobDetail/:jobId" element={<JobDetailPage />} />
          <Route path="/blogDetail/:blogId" element={<BlogDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          {user.user?.role === "candidate" && (
            <Route path="/profile" element={<ProfileCandidatePage />} />
          )}
          {user.user?.role === "candidate" && (
            <Route path="/favoriteJob" element={<FavoritePage />} />
          )}
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/registerForCandidate"
            element={<RegisterForCandidate />}
          />
          <Route
            path="/registerForEmployer"
            element={<RegisterForEmployer />}
          />
          <Route path="/page404" element={<Page404 error />} />
        </Routes>
        <FooterPage />
        <BackToTopButton />
      </div>
    </>
  );
}

export default UserApp;
