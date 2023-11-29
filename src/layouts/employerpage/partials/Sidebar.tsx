import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvide";
import { useEffect, useState } from "react";
import { ProfileModel } from "../../../models/ProfileModel";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileModel>();
  useEffect(() => {
    const fectchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/auth/profile/loadProfile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.token}`, // Replace with your actual authorization token
            },
          }
        );
        if (response.ok) {
          const profileData = await response.json();
          console.log(profileData);
          const profile = new ProfileModel(
            profileData.profileType,
            profileData.name,
            profileData.email,
            profileData.userImage,
            profileData.userCv,
            profileData.gender,
            profileData.phoneNumber,
            profileData.address,
            profileData.bio,
            profileData.companyName,
            profileData.companyLogo,
            profileData.companyImg1,
            profileData.companyImg2,
            profileData.companyImg3,
            profileData.taxNumber,
            profileData.specializationNames, // Pass specialization names as an array
            profileData.favoriteJob // Pass specialization names as an array
          );
          setProfile(profile);
        }
      } catch (error: any) { }
    };
    fectchProfile();
  }, []);

  return (
    <>
      <div className="sidebar container-fluid" id="sidebar">
        <div className="sidebar-inner slimscroll row">
          <div className="sidebar-contents">
            <div id="sidebar-menu" className="sidebar-menu">
              <div className="mobile-show">
                <div className="offcanvas-menu">
                  <div className="user-info align-center bg-theme text-center">
                    <span
                      className="lnr lnr-cross  text-white"
                      id="mobile_btn_close"
                    >
                      X
                    </span>
                    <a
                      href="javascript:void(0)"
                      className="d-block menu-style text-white"
                    >
                      <div className="user-avatar d-inline-block mr-3">
                        <img
                          alt="user avatar"
                          className="rounded-circle"
                          width="50"
                        />
                      </div>
                    </a>
                  </div>
                </div>
                <div className="sidebar-input">
                  <div className="top-nav-search">
                    <form>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search here"
                      />
                      <button className="btn" type="submit">
                        <i className="fas fa-search"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <ul>
                <li className="active">
                  <Link to="/employerDashboard">
                    <i
                      className="bi bi-speedometer"
                      style={{ fontSize: "1.5em" }}
                    ></i>
                    <span> Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link to="/jobManagement">
                    <i
                      className="bi bi-bookmarks-fill"
                      style={{ fontSize: "1.5em" }}
                    ></i>
                    <span>Jobs Management</span>
                  </Link>
                </li>
                <li>
                  <Link to="/postBlog">
                    <i
                      className="bi bi-folder-plus"
                      style={{ fontSize: "1.5em" }}
                    ></i>
                    <span>Post Blog</span>
                  </Link>
                </li>
                <li>
                  <Link to="/employerProfile">
                    <i
                      className="bi bi-folder-plus"
                      style={{ fontSize: "1.5em" }}
                    ></i>
                    <span>Profile</span>
                  </Link>
                </li>


                <li>
                  <button
                    type="button"
                    onClick={logout}
                    className="btn btn-warning w-100 mt-5"
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};
