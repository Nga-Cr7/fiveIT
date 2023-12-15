import { Route, Routes } from "react-router-dom";
import {Dashboard} from "./layouts/employerpage/partials/DashBoard";
import { EmployerHeader } from "./layouts/employerpage/partials/EmpoyerHeader";
import { Sidebar } from "./layouts/employerpage/partials/Sidebar";
import { ProfileEmployerPage } from "./layouts/employerpage/profile/ProfileEmployerPage";
import { BackToTopButton } from "./layouts/utils/BackToTopButton";
import { HeaderPage } from "./layouts/fragment/HeaderPage";
import { LoginPage } from "./layouts/authpage/LoginPage";
import { FooterPage } from "./layouts/fragment/FooterPage";
import { Page404 } from "./layouts/errors/Page404";
import { useEffect } from "react";
import { EmployerApprovedBlogPage } from "./layouts/employerpage/employerblog/EmployerApprovedBlogPage";
import { JobManagement } from "./layouts/employerpage/jobmanagement/JobManagement";
import { EmployerWaitingBlogPage } from "./layouts/employerpage/employerblog/EmployerWaitingBlogPage";
function EmployerApp() {
  return (
      <>
        <div className="container-xxl bg-white p-0">
          <HeaderPage />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/employerDashboard" element={<Dashboard />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/profileEmployer" element={<ProfileEmployerPage />} />
            <Route path="/profile" element={<ProfileEmployerPage />} />
            <Route path="/approvedEmployerBlogs" element={<EmployerApprovedBlogPage />} />
            <Route path="/waitingEmployerBlogs" element={<EmployerWaitingBlogPage />} />
            <Route path="/jobEmployerManagement" element={<JobManagement />} />
            {/* <Route path="/jobManagementEmployer" element={<CompanyPage />} />
            <Route path="/companyDetail/:email" element={<CompanyDetailPage />} />
            <Route path="/profileManagement" element={<BlogPage />} /> */} 
          
            <Route path="/page404" element={<Page404 error />} />
          </Routes>
          <FooterPage />
          <BackToTopButton />
        </div>
      </>

  );
}
export default EmployerApp;