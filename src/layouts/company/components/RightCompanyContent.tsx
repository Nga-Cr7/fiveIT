import { Link } from "react-router-dom";
import { JobModel } from "../../../models/JobModel";
import { useTranslation } from 'react-i18next';
export const RightCompanyContent: React.FC<{ job?: JobModel }> = (props) => {
  const { t } = useTranslation();
  const generateRandomString = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*()_+";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };
  const randomString = generateRandomString(50);

  const jobDetailLink = `/jobDetail/${randomString}-${props.job?.jobId}-${randomString}?applyNow=open`;
  return (
    <>
      <div className="row ">
        <div className="col-sm-12 d-flex align-items-center">
          
          {props.job?.jobImg ? (
            <img
              className="flex-shrink-0 img-fluid border rounded"
              src={props.job.jobImg}
              alt=""
              style={{ width: "50px", height: "50px", objectFit:'contain' }}
            />
          ) : (
            <img
              className="flex-shrink-0 img-fluid border rounded"
              src="../assets/img/com-logo-1.jpg"
              alt=""
              style={{ width: "50px", height: "50px",objectFit:'contain' }}
            />
          )}
          <Link className="text-start ps-4"  to={jobDetailLink}>
            <h5 className="mb-3">{props.job?.title}</h5>
          </Link>
        </div>

        <div className="row d-flex align-items-center">
          <div className="col-9 d-flex align-items-center">
            <span className="text-truncate me-3" style={{ display: "block" }}>
              <i className="bi bi-bookmark text-primary me-2"></i>
              {props.job?.jobCategory.categoryName}
            </span>
          </div>
          <div className="col-3">
            <Link
              to={jobDetailLink}
              className="btn btn-success fs-small"
            >
              {t('btn.btnApplyOne')}
            </Link>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};
