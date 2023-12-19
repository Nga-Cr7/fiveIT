import { Link } from "react-router-dom";
import { JobModel } from "../../../models/JobModel";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthProvide";
export const RightCompanyContent: React.FC<{ job?: JobModel }> = (props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  

  const jobDetailLink = `/jobDetail/${props.job?.jobId}?applyNow=open`;
  const jobDetail = `/jobDetail/${props.job?.jobId}`;

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  useEffect(() => {
    const fetchApply = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/loadApply", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (response.ok) {
          const list = await response.json();
          // setApplicantByUser(list);
          const btnDisabled = list.some(
            (item: { jobId: number }) => item.jobId === props.job?.jobId
          );
          setIsButtonDisabled(btnDisabled);
        }
      } catch (error) {
        console.log("Error fetching API:", error);
      }
    };

    if (user) {
      fetchApply();
    }
  }, []);
  return (
    <>
      <div className="row ">
        <div className="col-sm-12 d-flex align-items-center">
          {props.job?.jobImg ? (
            <img
              className="flex-shrink-0 img-fluid border rounded"
              src={props.job.jobImg}
              alt=""
              style={{ width: "50px", height: "50px", objectFit: "contain" }}
            />
          ) : (
            <img
              className="flex-shrink-0 img-fluid border rounded"
              src="../assets/img/com-logo-1.jpg"
              alt=""
              style={{ width: "50px", height: "50px", objectFit: "contain" }}
            />
          )}
          <Link className="text-start ps-4" to={jobDetail}>
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
            {isButtonDisabled ? (
              <button
                className="btn fs-small btn-warning d-flex align-items-center "
                disabled
              >
                {t("btn.btnApplied")}
              </button>
            ) : (
              <Link to={jobDetailLink} className="btn btn-success fs-small">
                {t("btn.btnApplyOne")}
              </Link>
            )}
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};
