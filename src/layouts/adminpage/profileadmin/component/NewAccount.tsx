import React, { useState } from "react";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export const NewAccount = () => {
  // const img = "/assets/img/login_register/signup_image.jpg";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const token: any = localStorage.getItem("jwt_token");
  const [isAgreed, setIsAgreed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({}); // Use Partial<FormData> to match formErrors type

  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateForm = () => {
    let errors: Partial<FormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = t("formErrors.nameRequired");
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = t("formErrors.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t("formErrors.emailInvalid");
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = t("formErrors.phoneRequired");
      isValid = false;
    } else if (!/^0\d{9}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = t("formErrors.phoneInvalid");
      isValid = false;
    }

    if (!formData.password) {
      errors.password = t("formErrors.passwordRequired");
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = t("formErrors.invalidPassword");
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t("formErrors.notMatchPassword");
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);

    // Automatically hide the toast after 3 seconds (3000 milliseconds)
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      setIsLoading(true);
      setTimeout(async () => {
        try {
          const formDt = new FormData();
          formDt.append("name", formData.name);
          formDt.append("email", formData.email);
          formDt.append("phoneNumber", formData.phoneNumber);
          formDt.append("password", formData.password);
          const response = await fetch(
            "http://localhost:8080/auth/admin/createNewAdmin",
            {
              method: "POST",
              headers: {
                // "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: formDt,
            }
          );

          if (response.ok) {
            setIsLoading(false);
            showToastMessage(t("showToastMessage.successRegisterMessage"));
          } else {
            setIsLoading(false);
            showToastMessage(t("showToastMessage.errorRegisterMessage"));
          }
        } catch (error) {
          // Handle network error
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    }
  };

  if (isLoading) {
    return <SpinnerLoading />;
  }

  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="row g-3 mt-4 needs-validation  d-flex flex-column justify-content-center align-items-center"
      >
        <div className="col-md-8 ">
          <label htmlFor="Fullname" className="form-label">
            {t("placeholders.fullName")}
          </label>
          <div className="mb-3 input-group">
            <input
              type="text"
              id="name"
              className="form-control"
              name="name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          {formErrors.name && (
            <span className="error-message text-danger">{formErrors.name}</span>
          )}
        </div>

        <div className="col-md-8 ">
          <label htmlFor="email" className="form-label">
            {t("placeholders.email")}
          </label>
          <div className="mb-3 input-group">
            <input
              type="email"
              id="email"
              className="form-control"
              name="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          {formErrors.email && (
            <span className="error-message text-danger">
              {formErrors.email}
            </span>
          )}
        </div>

        <div className="col-md-8 ">
          <label htmlFor="phoneNumber" className="form-label">
            {t("placeholders.phoneNumber")}
          </label>
          <div className="mb-3 input-group">
            <input
              type="number"
              id="phoneNumber"
              className="form-control"
              name="phoneNumber"
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              required
            />
          </div>
          {formErrors.email && (
            <span className="error-message text-danger">
              {formErrors.phoneNumber}
            </span>
          )}
        </div>

        <div className="col-md-8">
          <label htmlFor="currentPassword" className="form-label">
            {t("placeholders.password")}
          </label>
          <div className="mb-3 input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="pass"
              id="pass"
              className="form-control"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              required
            />
            <span
              className="input-group-text"
              onClick={togglePasswordVisibility}
            >
              <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
            </span>
          </div>
          {formErrors.password && (
            <span className="error-message text-danger">
              {formErrors.password}
            </span>
          )}
        </div>
        <div className="col-md-8">
          <label htmlFor="confirmPassword" className="form-label">
            {t("placeholders.confirmPassword")}
          </label>
          <div className="mb-3 input-group">
            <input
              type="password"
              name="re-pass"
              id="re-pass"
              className="form-control"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
          </div>
          {formErrors.confirmPassword && (
            <span className="error-message text-danger">
              {formErrors.confirmPassword}
            </span>
          )}
        </div>
        <div className="col-md-8 mt-4 text-center">
          <button className="btn btn-success" type="submit">
            {t("btn.btnSave")}
          </button>
        </div>
      </form>

      {showToast === true && (

        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
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
              <strong className="me-auto">{t("showToastMessage.status")}</strong>
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
      )}
    </>
  );
};
