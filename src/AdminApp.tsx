import { Navigate, Route, Routes } from "react-router-dom";
import "./layouts/adminpage/css/bootstrap.min.css";
import "./layouts/adminpage/css/style.css";

import { AdminHeader } from "./layouts/adminpage/partials/AdminHeader";
import Dashboard from "./layouts/adminpage/partials/DashBoard";
import { Sidebar } from "./layouts/adminpage/partials/Sidebar";
import { BackToTopButton } from "./layouts/utils/BackToTopButton";
import { CandidateAdminPage } from "./layouts/adminpage/candidate/CandidateAdminPage";
import { EmployerAdminPage } from "./layouts/adminpage/employeradminpage/EmployerAdminPage";
import { WaitingEmployerAdminPage } from "./layouts/adminpage/employeradminpage/WaitingEmployerAdminPage";
import { OpenContactAdminPage } from "./layouts/adminpage/contact/OpenContactAdminPage";
import { CloseContactAdminPage } from "./layouts/adminpage/contact/CloseContactAdminPage";
import { ApprovedBlogAdminPage } from "./layouts/adminpage/blogadmin/ApprovedBlogAdminPage";
import { WaitingBlogAdminPage } from "./layouts/adminpage/blogadmin/WaitingBlogAdminPage";
import { WaitingJobAdminPage } from "./layouts/adminpage/jobs/WaitingJobAdminPage";
import { ApprovedJobAdminPage } from "./layouts/adminpage/jobs/ApprovedJobAdminPage";
import { CategoryAdminPage } from "./layouts/adminpage/category/CategoryAdminPage";
import { ProfileAdminPage } from "./layouts/adminpage/profileadmin/ProfileAdminPage";
import { LoginPage } from "./layouts/authpage/LoginPage";
function AdminApp() {
  return (
    <>
      <div className="position-relative bg-white d-flex p-0">
        <Sidebar />
        <div className="content">
          <AdminHeader />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/home" element={<Dashboard />} /> */}
            <Route path="/candidate" element={<CandidateAdminPage />} />
            <Route path="/employer/approvedEmployer" element={<EmployerAdminPage />} />
            <Route path="/employer/waitingEmployer" element={<WaitingEmployerAdminPage />} />
            <Route path="/category" element={<CategoryAdminPage />} />
            <Route path="/job/approvedJob" element={<ApprovedJobAdminPage />} />
            <Route path="/job/waitingJob" element={<WaitingJobAdminPage />} />
            <Route path="/blog/approvedBlog" element={<ApprovedBlogAdminPage />} />
            <Route path="/blog/waitingBlog" element={<WaitingBlogAdminPage />} />
            <Route path="/contact/openContact" element={<OpenContactAdminPage />} />
            <Route path="/contact/closeContact" element={<CloseContactAdminPage />} />
            <Route path="/admin/profile" element={<ProfileAdminPage />} />
          </Routes>
        </div>
      </div>
      <BackToTopButton />


      <style>
        {`
          .sidebar .navbar .navbar-nav .nav-link {
            padding: 7px 5px !important;
          }
          
        `}
    </style>
    </>
  );
}
export default AdminApp;