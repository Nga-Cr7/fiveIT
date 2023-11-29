import React from "react";

import { UserManagementModel } from "../../../models/UserManagementModel";
import { useTranslation } from 'react-i18next';
export const CompanyBanner: React.FC<{
  profile?: UserManagementModel;
  numberOfJobs: number;
}> = (props) => {

  const { t } = useTranslation();
  return (
    <div
      className="container-xxl py-3 mb-5 position-relative"
      style={{
        height: "400px",
       
        backgroundImage: "url('../assets/img/companybanner2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "bottom"
      }}
    >
      <div
        className="row align-items-end row position-absolute"
        style={{ bottom: "50px", left: "50px" }}
      >
        <div className="col-md-12">
          <div className="d-flex">
            <div className="row">
              <div className="col-3 mt-5">
                <div
                  className="image-container"
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {props.profile?.companyLogo ? (
                    <img
                      className="img-fluid border border-4 border-dark rounded "
                      src={props.profile.companyLogo}
                      alt="Logo"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        width: "100%",
                      }}
                    />
                  ) : (
                    <img
                      className="img-fluid border rounded"
                      src="https://res.cloudinary.com/dzqoi9laq/image/upload/v1699419757/logoo_pyz2sp.png"
                      alt=""
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        width: "100%",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="col-8">
                <div className="d-flex mt-5 ms-4 flex-column ">
                  {/* Use flex-column for vertical alignment */}
                  <div className="company-name text-start">
                    <h1 className="text-light">{props.profile?.companyName}</h1>
                  </div>
                  <div className="company-name text-start mb-1">
                    <h5 className="text-light">
                    {t('companyDetail.openJob')} {props.numberOfJobs ?? ""}
                    </h5>
                  </div>

                  <div className="d-flex align-items-start">
                    <div className="text-center">
                      <i className="fa fa-map-marker-alt text-primary"></i>
                    </div>
                    <div className="address ms-2">
                      <span className="text-light text-truncate">
                        {props.profile?.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* <div className=" my-5 pt-5 pb-4 row">
        <h2 className=" text-white mb-3 animated slideInDown">
          {props.profile?.companyName} FPT SOF
        </h2>
        
          <div className="d-flex align-items-center mb-5">
            {"" ? (
              <img
                className="flex-shrink-0 img-fluid border rounded"
                src={props.profile?.companyLogo}
                alt=""
                style={{ width: "80px", height: "80px" }}
              />
            ) : (
              <img
                className="flex-shrink-0 img-fluid border rounded"
                src="../assets/img/com-logo-1.jpg"
                alt=""
                style={{ width: "120px", height: "120px" }}
              />
            )}
            <div className="text-start ps-4">
              <div className="mb-4 row">
                <div className="col-sm-6 mb-3">
                  <button className="btn btn-danger btn-block">Follow</button>
                </div>
                <div className="col-sm-6">
                  <button className="btn btn-light btn-block">Contact </button>
                </div>
              </div>
              <div className="text-truncate me-3">
                <i className="fa fa-map-marker-alt text-primary me-2"></i>{" "}
                {props.profile?.address}
              </div>
            </div>
          </div>
        
      </div> */
