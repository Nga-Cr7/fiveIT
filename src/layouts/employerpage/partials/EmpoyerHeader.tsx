import { useAuth } from "../../utils/AuthProvide";
import { useEffect, useState } from "react";
import { ProfileModel } from "../../../models/ProfileModel";
import { Link } from "react-router-dom";
export const EmployerHeader = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileModel>();
  useEffect(()=>{
    const fectchProfile = async()=>{

      try {
        const response = await fetch("http://localhost:8080/auth/profile/loadProfile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.token}`, // Replace with your actual authorization token
          },
        });
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
        
      } catch (error: any) {
       
      }
    }
    fectchProfile();
  },[])
  return (
    <>

        <div className="header">

          <div className="header-left">
            <Link to="/employerDashboard" className="logo">
              <img src={profile?.companyLogo} alt="Logo" width="60" height="60" />
            </Link>
            <a href="index.html" className="logo logo-small">
              <img src="assets/img/logo-small.png" alt="Logo" width="60" height="60" />
            </a>
            <a href="javascript:void(0);" id="toggle_btn">
              <span className="bar-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </a>
          </div>

          <div className="top-nav-search">
            <form>
              <input type="text" className="form-control" placeholder="" />
              <button className="btn" type="submit"><i className="fas fa-search"></i></button>
            </form>
          </div>


          <a className="mobile_btn" id="mobile_btn">
            <i className="fas fa-bars"></i>
          </a>


          <ul className="nav user-menu">
            <li className="nav-item dropdown">
              <a href="#" className="dropdown-toggle nav-link pr-0" data-toggle="dropdown">
              <i className="bi bi-bell-fill"></i><span className="badge badge-pill"></span>
              </a>
              <div className="dropdown-menu notifications">
                <div className="topnav-dropdown-header">
                  <span className="notification-title">Notifications</span>
                  <a href="javascript:void(0)" className="clear-noti"> Clear All</a>
                </div>
                <div className="noti-content">
                  <ul className="notification-list">
                    <li className="notification-message">
                      <a href="activities.html">
                        <div className="media">
                          <span className="avatar avatar-sm">
                            <img className="avatar-img rounded-circle" alt=""
                              src="assets/img/profiles/avatar-02.jpg" />
                          </span>
                          <div className="media-body">
                            <p className="noti-details"><span className="noti-title">Brian Johnson</span>
                              paid the invoice <span className="noti-title">#DF65485</span></p>
                            <p className="noti-time"><span className="notification-time">4 mins ago</span>
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="notification-message">
                      <a href="activities.html">
                        <div className="media">
                          <span className="avatar avatar-sm">
                            <img className="avatar-img rounded-circle" alt=""
                              src="assets/img/profiles/avatar-03.jpg" />
                          </span>
                          <div className="media-body">
                            <p className="noti-details"><span className="noti-title">Marie Canales</span>
                              has accepted your estimate <span
                                className="noti-title">#GTR458789</span></p>
                            <p className="noti-time"><span className="notification-time">6 mins ago</span>
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="notification-message">
                      <a href="activities.html">
                        <div className="media">
                          <div className="avatar avatar-sm">
                            <span className="avatar-title rounded-circle bg-primary-light"><i
                              className="far fa-user"></i></span>
                          </div>
                          <div className="media-body">
                            <p className="noti-details"><span className="noti-title">New user
                              registered</span></p>
                            <p className="noti-time"><span className="notification-time">8 mins ago</span>
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="notification-message">
                      <a href="activities.html">
                        <div className="media">
                          <span className="avatar avatar-sm">
                            <img className="avatar-img rounded-circle" alt=""
                              src="assets/img/profiles/avatar-04.jpg" />
                          </span>
                          <div className="media-body">
                            <p className="noti-details"><span className="noti-title">Barbara Moore</span>
                              declined the invoice <span className="noti-title">#RDW026896</span></p>
                            <p className="noti-time"><span className="notification-time">12 mins ago</span>
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="notification-message">
                      <a href="activities.html">
                        <div className="media">
                          <div className="avatar avatar-sm">
                            <span className="avatar-title rounded-circle bg-info-light"><i
                              className="far fa-comment"></i></span>
                          </div>
                          <div className="media-body">
                            <p className="noti-details"><span className="noti-title">You have received a new
                              message</span></p>
                            <p className="noti-time"><span className="notification-time">2 days ago</span>
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="topnav-dropdown-footer">
                  <a href="activities.html">View all Notifications</a>
                </div>
              </div>
            </li>


            <li className="nav-item dropdown has-arrow main-drop">
              <a href="#" className="dropdown-toggle nav-link" data-toggle="dropdown">
                <span className="user-img">
                  <img src={profile?.companyLogo} alt="" />
                  <span className="status online"></span>
                </span>
                <span>Kavin Hansen</span>
              </a>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="profile.html"><i data-feather="user" className="mr-1"></i>
                  Profile</a>
                <a className="dropdown-item" href="login.html"><i data-feather="log-out" className="mr-1"></i>
                  Logout</a>
              </div>
            </li>

          </ul>
          <div className="dropdown mobile-user-menu show">
            <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i
              className="fa fa-ellipsis-v"></i></a>
            <div className="dropdown-menu dropdown-menu-right ">
              <a className="dropdown-item" href="profile.html">My Profile</a>
              <a className="dropdown-item" href="settings.html">Settings</a>
              <a className="dropdown-item" href="login.html">Logout</a>
            </div>
          </div>

        </div>


        



      
    </>
  );
};