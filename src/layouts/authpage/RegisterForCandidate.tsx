import React, { useState } from "react";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { Link ,useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForCandidate = () => {
  // const img = "/assets/img/login_register/signup_image.jpg";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const [isAgreed, setIsAgreed] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
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
      errors.email =  t("formErrors.emailRequired");
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
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password
      )
    ) {
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
          const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              registerType: "candidate",
              name: formData.name,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
              password: formData.password,
            }),
          });

          if (response.ok) {
            setIsLoading(false);
            showToastMessage(t("showToastMessage.successRegisterMessage"));
            navigate("/login");

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
      <div className="container" style={{ padding: "100px" }}>
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div
              className="auth-inner"
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "5px",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="auth-form" style={{ textAlign: "left" }}>
                <div className="header" style={{ marginBottom: "20px" }}>
                  <h4
                    className="title"
                    style={{ color: "#00B074", textAlign: "left" }}
                  >
                    {t("register.welcome3")}
                  </h4>
                  <div
                    className="text-muted caption"
                    style={{ color: "#6c757d", textAlign: "left" }}
                  >
                    {t("register.welcome4")}
                  </div>
                </div>
                <div className="register">
                  <form
                    method="post"
                    id="form-register"
                    onSubmit={handleSubmit}
                  >
                    <div className="form-group mb-3">
                      <label
                        htmlFor="name"
                        className="mb-8"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("placeholders.fullName")}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="bi bi-person"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="form-control"
                          placeholder= {t("placeholders.fullName")}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      {formErrors.name && (
                        <span className="error-message text-danger">
                          {formErrors.name}
                        </span>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label
                        htmlFor="email"
                        className="mb-8"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("placeholders.email")}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="bi bi-envelope"></i>
                          </span>
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="form-control"
                          placeholder={t("placeholders.email")}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      {formErrors.email && (
                        <span className="error-message text-danger">
                          {formErrors.email}
                        </span>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label
                        htmlFor="phoneNumber"
                        className="mb-8"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("placeholders.phoneNumber")}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="bi bi-phone"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          className="form-control"
                          placeholder={t("placeholders.phoneNumber")}
                          onChange={(e) =>
                            setFormData({ ...formData, phoneNumber: e.target.value })
                          }
                        />
                      </div>
                      {formErrors.phoneNumber && (
                        <span className="error-message text-danger">
                          {formErrors.phoneNumber}
                        </span>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label
                        htmlFor="pass"
                        className="mb-8"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("placeholders.password")}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="bi bi-lock"></i>
                          </span>
                        </div>
                        <input
                          type="password"
                          name="pass"
                          id="pass"
                          className="form-control"
                          placeholder= {t("placeholders.password")}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                      {formErrors.password && (
                        <span className="error-message text-danger">
                          {formErrors.password}
                        </span>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label
                        htmlFor="re-pass"
                        className="mb-8"
                        style={{ fontWeight: "bold" }}
                      >
                         {t("placeholders.confirmPassword")}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="bi bi-lock"></i>
                          </span>
                        </div>
                        <input
                          type="password"
                          name="re-pass"
                          id="re-pass"
                          className="form-control"
                          placeholder={t("placeholders.confirmPassword1")}
                        
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      {formErrors.confirmPassword && (
                        <span className="error-message text-danger">
                          {formErrors.confirmPassword}
                        </span>
                      )}
                    </div>
                    {/* Tiếp tục thêm các trường và nút đăng ký khác ở đây */}
                    <div className="form-group mt-3">
                      <div className="d-flex align-items-start gap-2">
                        <div className="pdt-2">
                          {/* <input id="agreement" name="agreement" type="checkbox" checked="" /> */}
                          <input
                            id="agreement"
                            name="agreement"
                            type="checkbox"
                            onChange={handleCheckboxChange}
                            checked={isChecked}
                          />
                          <label htmlFor="agreement"></label>
                        </div>
                        <p className="agree-term mb-3">
                          <label htmlFor="agree-term">
                          {t("register.termService")}{" "}
                            <a
                              target="_blank"
                              href=""
                              className="text-success"
                              style={{ fontWeight: "bold" }}
                            >
                               {t("register.termService1")}
                            </a>{" "}
                            {t("register.and")}{" "}
                            <a
                              target="_blank"
                              href="https://www.topcv.vn/dieu-khoan-bao-mat"
                              className="text-success"
                              style={{ fontWeight: "bold" }}
                            >
                              {t("register.termService2")}
                            </a>{" "}
                            {t("register.ofFiveITViec")}
                          </label>
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <button
                        type="submit"
                        name="signup"
                        id="signup"
                        className="btn btn-primary w-100"
                        disabled={!isChecked}
                      >
                        {t("btn.btnSignUp")}
                      </button>
                    </div>
                  </form>
                  
                </div>
                <div className="mb-3" style={{ marginTop: "40px" }}>
                  <p className="or text-center fz-12px">
                  {t("register.hasAccount")}{" "}
                    <Link
                      to="/login"
                      style={{ color: "#00B074", fontWeight: "bold" }}
                    >
                      {t("btn.btnLogin")}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
        <div
          className={`toast ${showToast ? "show" : ""}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
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
    </>
  );
};
