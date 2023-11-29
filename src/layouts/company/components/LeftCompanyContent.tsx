import { UserManagementModel } from "../../../models/UserManagementModel";
import { useTranslation } from 'react-i18next';
export const LeftCompanyContent: React.FC<{
  profile?: UserManagementModel;
  specializationNames?: string[];
}> = (props) => {
  
  const { t } = useTranslation();
  return (
    <>
      <div className="col-lg-8">
        <div className="mb-5">
          <div className="rounded p-3 bg-light bg-gradient text-dark mb-4">
            <span className="h4 border-bottom-dashed">{t('companyDetail.details.left.general')}</span>
            <hr />
            <div className="row gx-0">
              <div className="col-md-4 d-flex flex-md-column justify-content-between border-bottom-dotted-sm py-2 py-md-0">
                <div className="text-dark-grey fs-5 d-flex align-items-center">
                  <span className="company-type-text ">{t('companyDetail.details.left.type')}</span>
                </div>
                <div className="normal-text fs-5 text-muted">{t('companyDetail.details.left.product')}</div>
              </div>
              <div className="col-md-4 d-flex flex-md-column justify-content-between border-bottom-dotted-sm py-2 py-md-0">
                <div className="text-dark-grey fs-5">{t('companyDetail.details.left.workingDay')}</div>
                <div className="normal-text fs-5 text-muted">
                {t('companyDetail.details.left.workingFromTo')}
                </div>
              </div>
              <div className="col-md-4 d-flex flex-md-column justify-content-between border-bottom-dotted-sm py-2 py-md-0">
                <div
                  className="text-dark-grey fs-5 d-flex align-items-center"
                  style={{ fontFamily: "Font1, sans-serif" }}
                >
                  {t('companyDetail.details.left.country')}
                </div>

                <div
                  className="normal-text fs-5 text-muted"
                  style={{ fontFamily: "Noto Sans, sans-serif" }}
                >
                  {" "}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_North_Vietnam_%281945%E2%80%931955%29.svg/230px-Flag_of_North_Vietnam_%281945%E2%80%931955%29.svg.png"
                    alt="Vietnamese Flag"
                    className="rounded-circle me-2 "
                    width="20"
                    height="20"
                  />
                  {t('companyDetail.details.left.vietnam')}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded p-3 bg-light bg-gradient text-dark mb-4">
            <span className="h4 border-bottom-dashed">{t('companyDetail.details.left.overview.overview')}</span>
            <hr />
            <div>
              <p>
              {t('companyDetail.details.left.overview.overview1')}
              </p>
              <p>
              {t('companyDetail.details.left.overview.overview2')}
              </p>
              <p>
                <b>{props.profile?.companyName}</b> {t('companyDetail.details.left.overview.overview3')}
              </p>
              <ul>
                <li>
                {t('companyDetail.details.left.overview.overview4')}
                </li>
                <li>
                {t('companyDetail.details.left.overview.overview5')}
                </li>
                <li>
                {t('companyDetail.details.left.overview.overview6')}
                </li>
                <li>
                {t('companyDetail.details.left.overview.overview7')}
                </li>
                <li>
                {t('companyDetail.details.left.overview.overview8')}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <div className="rounded p-3 bg-light bg-gradient text-dark mb-4">
            <span className="h4 border-bottom-dashed">{t('companyDetail.details.left.keyskill')}</span>
            <div className="itag-light mt-3">
              {props.specializationNames ? (
                props.specializationNames.map((specialization, index) => (
                  <span
                    key={index}
                    className="keyword p-2"
                    style={{
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    {specialization}
                  </span>
                ))
              ) : (
                <span></span>
              )}
            </div>
            
          </div>
        </div>

      </div>
      <style>
        {`
        .custom-font {
          font-family: 'Noto Sans', sans-serif;
        }
        .keyword {
          border: 1px solid #ccc;
          border-radius: 20px; /* Điều chỉnh độ cong của góc */
          padding: 5px 15px;
          margin: 5px;
          cursor: pointer;
          transition: background-color 0.3s; /* Hiệu ứng hover màu nền */
        }
        
        .keyword:hover {
          background-color:#198754; /* Màu nền khi hover */
          color: #fff; /* Màu chữ khi hover */
        }
        
        `}
      </style>
    </>
  );
};
