import { Link } from "react-router-dom";
import { UserManagementModel } from "../../../models/UserManagementModel";
import { useTranslation } from 'react-i18next';
export const Company: React.FC<{ company: UserManagementModel }> = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="col-lg-6 mb-3" data-aos="zoom-in" data-aos-delay="100">
        <div className="member d-flex align-items-start">
          <div className="row">
            <div className="col-md-3">
              <div className="pic">
                <img
                  src={props.company.companyLogo ?? ""}
                  className="img-fluid rounded"
                  alt=""
                />
              </div>
            </div>
            <div className="col-md-9">
              <div className="member-info">
                <div
                  className="row"
                  style={{ maxHeight: "150px", overflow: "hidden" }}
                >
                  <Link
                    // to={`/companyDetail/${props.company.companyName}`}
                    to={{
                      pathname: `/companyDetail/${props.company.companyName}`,
                      search: `userId=${props.company.userId}`, // Truyền userId dưới dạng query parameter
                    }}
                  >
                    <div className="col-md-12">
                      <h4>{props.company.companyName}</h4>
                    </div>
                  </Link>
                  <div className="col-md-12">
                    <div className="d-flex align-items-center">
                      <i className="fa fa-map-marker-alt me-2 mb-2"></i>
                      <span>{props.company.address}</span>
                    </div>
                  </div>
                  <div className="col-md-12 mb-2">
                    <p>{props.company.bio}</p>
                  </div>
                  <div className="col-md-12">
                    <div className="d-flex justify-content-end">
                      <Link
                        // to={`/companyDetail/${props.company.companyName}`}
                        to={{
                          pathname: `/companyDetail/${props.company.companyName}`,
                          search: `userId=${props.company.userId}`, // Truyền userId dưới dạng query parameter
                        }}
                        className="btn btn-primary me-3 mb-2"
                        style={{ position: "absolute", bottom: 0, right: 0 }}
                      >
                       {t('btn.btnViewCompany')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`

.team .member {
  position: relative;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  border-radius: 5px;
  background: #fff;
  transition: 0.5s;
  height: 100%;
}

.team .member .pic {
  overflow: hidden;
  width: 150px;
  height:150px;
}

.team .member .pic img {
  transition: ease-in-out 0.3s;
  border-radius: 10px;
}

.team .member:hover {
  transform: translateY(-10px);
}

.team .member .member-info {
  padding-left: 30px;
}

.team .member h4 {
  font-weight: 700;
  margin-bottom: 5px;
  font-size: 20px;
  color: #37517e;
}

.team .member span {
  display: block;
  font-size: 15px;
  padding-bottom: 10px;
  position: relative;
  font-weight: 500;
}

.team .member span::after {
  content: "";
  position: absolute;
  display: block;
  width: 50px;
  height: 1px;
  background: #cbd6e9;
  bottom: 0;
  left: 0;
}

.team .member p {
  margin: 10px 0 0 0;
  font-size: 14px;
}

.team .member .social {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.team .member .social a {
  transition: ease-in-out 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  width: 32px;
  height: 32px;
  background: #eff2f8;
}

.team .member .social a i {
  color: #37517e;
  font-size: 16px;
  margin: 0 2px;
}

.team .member .social a:hover {
  background: #47b2e4;
}

.team .member .social a:hover i {
  color: #fff;
}

.team .member .social a+a {
  margin-left: 8px;
}
            `}
      </style>
    </>
   
  );
};
