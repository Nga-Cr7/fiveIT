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
        // backgroundImage: `url('${props.profile?.companyImg1 ? props.profile?.companyImg1 : "../assets/img/companybanner2.jpg"}')`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        
      }}
    >
      <div
        className="row align-items-end row position-absolute"
        style={{ bottom: "50px", left: "50px" }}
      >
        <div className="col-md-12">
          <div className="d-flex center">
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
                      className="img-fluid rounded "
                      // className="img-fluid border border-4 border-dark rounded "
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
              <div className="col-9 mt-5">
                <div className="d-flex mt-5 ms-4 flex-column justify-content-center">
                  {/* Use flex-column for vertical alignment */}
                  <div className="company-name text-start w-100 ">
                    <h1 className="text-light w-100">{props.profile?.companyName}</h1>
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

