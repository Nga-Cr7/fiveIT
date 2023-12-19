import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { JobModel } from "../../../models/JobModel";
import { useAuth } from "../../utils/AuthProvide";
import { useTranslation } from "react-i18next";

export const Jobs: React.FC<{ job: JobModel; onClick: () => void }> = (
  props
) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isIconDisabled, setIsIconDisabled] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const jobId = props.job.jobId;

  const jobDetailLink = `/jobDetail/${jobId}`;

  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    if (message === t("showToastMessage.pleaseLogin")) {
      const toastMessage = document.querySelector(".toast-message");
      if (toastMessage) {
        toastMessage.addEventListener("click", () => {
          navigate("/login"); // Replace '/home' with the actual URL of your home page
        });
      }
    }
    setTimeout(() => setShowToast(false), 3000);
  };

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
            (item: { jobId: number }) => item.jobId === props.job.jobId
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

  function checkApply(jobId: any) {
    navigate(`${jobDetailLink}?applyNow=open`);
  }

  // Function to toggle favorite status
  const toggleFavorite = async () => {
    try {
      if (isIconDisabled) {
        await actionFavoriteJob();
        setIsIconDisabled(false);
      } else {
        await actionFavoriteJob();
        setIsIconDisabled(true);
      }
      props.onClick();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const actionFavoriteJob = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };
      const formData = new FormData();
      formData.append("jobId", jobId ? jobId.toString() : "");
      const response = await fetch(
        "http://localhost:8080/auth/actionFavoriteJob",
        {
          method: "POST",
          headers,
          body: formData,
        }
      );
      if (response.ok) {
        const message = await response.text();
        if (message == "Add success") {
          showToastMessage(
            `${t("showToastMessage.add")} ${props.job.title} ${t(
              "showToastMessage.successFavorite"
            )}`
          );
        } else {
          showToastMessage(
            `${t("showToastMessage.remove")} ${props.job.title} ${t(
              "showToastMessage.successFavorite"
            )}`
          );
        }
      } else {
        console.error("Failed to toggle favorite");
        // throw new Error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error("Error favoriting/unfavoriting job:", error);
      throw error;
    }
  };

  function padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  function formatDateTime(dateTimeString: any) {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = padZero(dateTime.getMonth() + 1);
    const day = padZero(dateTime.getDate());
    const hours = padZero(dateTime.getHours());
    const minutes = padZero(dateTime.getMinutes());
    const seconds = padZero(dateTime.getSeconds());
    return `${year}-${month}-${day}`;
  }

  return (
    <>
      <div className="job-item p-4 mb-4">
        <div className="row g-4">
          <div className="col-sm-12 col-md-8 d-flex align-items-center">
            {props.job.jobImg ? (
              <img
                className="flex-shrink-0 img-fluid border rounded"
                src={props.job.jobImg}
                alt=""
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            ) : (
              <img
                className="flex-shrink-0 img-fluid border rounded"
                src="../assets/img/com-logo-1.jpg"
                alt=""
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            )}
            <Link to={jobDetailLink} className="text-start ps-4">
              <h5 className="mb-3">{props.job.title}</h5>
              <span className="text-truncate me-3">
                <i className="fa fa-map-marker-alt text-primary me-2"></i>
                {props.job.jobCategory.categoryName}
              </span>

              <span className="text-truncate me-3">
                <i className="far fa-clock text-primary me-2"></i>Full Time
              </span>
              <span className="text-truncate me-0">
                <i className="far fa-money-bill-alt text-primary me-2"></i>${" "}
                {props.job.salary}
              </span>
            </Link>
          </div>
          <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
            <div className="d-flex mb-3">
              {isIconDisabled ? (
                <button
                  className="btn btn-square me-3"
                  onClick={toggleFavorite}
                >
                  <i className="fas fa-heart text-primary"></i>
                </button>
              ) : (
                <button
                  className="btn btn-square me-3"
                  onClick={toggleFavorite}
                >
                  <i className="far fa-heart text-primary"></i>
                </button>
              )}

              {isButtonDisabled ? (
                <button
                  className="btn btn-warning"
                  style={{ width: "110px" }}
                  disabled
                >
                  {t("btn.btnApplied")}
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => checkApply(props.job.jobId)}
                >
                  {t("btn.btnApply")}
                </button>
              )}
            </div>
            <small className="text-truncate">
              <i className="far fa-calendar-alt text-primary me-2"></i>
              {formatDateTime(props.job.createdAt)}
            </small>
          </div>
        </div>

        <div
          className="position-fixed bottom-0 end-0 p-3 toast-message"
          style={{ zIndex: "999" }}
        >
          <div
            className={`toast ${showToast ? "show" : ""}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div
              className="toast-header"
              style={{ backgroundColor: "#198754", color: "white" }}
            >
              <strong className="me-auto">
                {t("showToastMessage.status")}
              </strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body">{message}</div>
          </div>
        </div>
      </div>
    </>
  );
};
