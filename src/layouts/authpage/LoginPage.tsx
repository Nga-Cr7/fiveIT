import "./style.css";
import { Link, useNavigate  } from "react-router-dom";
import { useEffect, useState,  } from "react";
import jwt_decode from "jwt-decode";
import { useAuth } from "../utils/AuthProvide";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { LoginWithGoogle } from "./components/LoginWithGoogle";
import { LoginWithFacebook } from "./components/LoginWithFacebook";
import { useTranslation } from 'react-i18next';



interface FormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  localStorage.removeItem("jobCate");

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgetModalOpen, setIsForgetModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if(user){
      if (user?.role === "admin") {
        navigate('/dashboard');
      }
      else {
        navigate('/home');
      }
    }
    
  }, [user]);

  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const openForgetModal = () => {
    setIsForgetModalOpen(true);
  };

  const closeForgetModal = () => {
    setIsForgetModalOpen(false);
  };

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    let errors: Partial<FormData> = {};
    let isValid = true;

    if (!formData.email.trim()) {
      errors.email = t("formErrors.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t("formErrors.emailInvalid");
      isValid = false;
    }

    if (!formData.password) {
      errors.password = t("formErrors.passwordRequired");
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const responseToken = await response.json();
          const token = responseToken.accessToken;
          const decodedToken: any = jwt_decode(token);
          const name = decodedToken.sub;
          const role = decodedToken.role;
          login(token, name, role);

          const redirectToPage = localStorage.getItem('redirectToPage');
          // eslint-disable-next-line no-lone-blocks
          if (role === "admin") {
            navigate("/dashboard");
          } else if (role === "employer") {
            navigate("/employerDashboard");
          } else if (role === "candidate") {
            if (redirectToPage) {
              localStorage.removeItem('redirectToPage');
              navigate(redirectToPage);
            }else{
                navigate("/home");
            }
            
          }
          setIsLoading(false);
        } else {
          const data = await response.json();
          console.log(data);
          if (data.error === "NO PASSWORD") {
            showToastMessage(t('showToastMessage.errorWrongPassword'));
          }
          if (data.error === "NO EMAIL") {
            showToastMessage(t('showToastMessage.errorWrongEmail'));
          }
          if (data.error === "DISABLE") {
            showToastMessage(t('showToastMessage.errorDisableAccount'));

          }
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Network error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const [errorResetPassword, setErrorResetPassword] = useState<string | null>(null);


  const handleForgetPassWordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const email = (document.getElementById("email_resetPassword") as HTMLInputElement).value;
    try {
      const response = await fetch(`http://localhost:8080/auth/resetPassword?email=${email}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (response.ok) {
        setIsLoading(false);
        closeForgetModal();
        showToastMessage(t('showToastMessage.checkEmail'));

      } else {
        const data = await response.text();
        setIsLoading(false);
        setErrorResetPassword(data);
        console.log(data)
      }
    } catch (error) {
      console.log("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (isLoading) {
    return <SpinnerLoading />;
  }


  return (
    <>
      <div className="container p-3">
        <div className="row justify-content-center mt-5">
          <div className="col-md-7 col-12">
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
                    {t('login.welcome')}
                  </h4>
                  <div
                    className="text-muted caption"
                    style={{ color: "#6c757d", textAlign: "left" }}
                  >
                     {t('login.welcome1')}
                  </div>
                </div>
                <div className="login">
                  <form method="post" id="form-login" onSubmit={handleSubmitLogin}>
                    <div className="mb-3">
                      <label
                        htmlFor="email"
                        className="form-label"
                        style={{ textAlign: "left", fontWeight: "bold" }}
                      >
                        {t('placeholders.email')}
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder={t('placeholders.email')}
                          aria-label="Email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <span className="error-message text-danger" >{formErrors.email}</span>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="password"
                        className="form-label"
                        style={{ textAlign: "left", fontWeight: "bold" }}
                      >
                        {t('placeholders.password')}
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control"
                          placeholder={t('placeholders.password')}
                          aria-label="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <div>
                        </div>
                      </div>
                      <span className="error-message text-danger">{formErrors.password}</span>
                    </div>
                    <div
                      className="mb-3"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <a
                        onClick={openForgetModal}
                        style={{
                          color: "#00B074",
                          textAlign: "right",
                          fontWeight: "bold",
                          cursor: "pointer"
                        }}
                      >
                        {t('btn.btnForget')}
                      </a>
                    </div>

                    <div className="mb-3">
                      <button type="submit" className="btn btn-primary w-100" name="signin" id="signin" value="Log in">
                      {t('btn.btnLogin')}
                      </button>
                      <div style={{ marginTop: "20px" }}>
                        <p className="or text-center fz-12px">
                        {t('login.orLogin')}
                        </p>
                      </div>
                    </div>
                  </form>
                  <div className="d-flex justify-content-center">
                    <div className="d-flex align-items-center">
                      <div className="mx-3">
                        <LoginWithGoogle />
                      </div>
                      <div className="mx-3">
                        <LoginWithFacebook />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3" style={{ marginTop: "40px" }}>
                    <p className="or text-center fz-12px">
                    {t('login.noAccount')}{" "}
                      <a
                        style={{ color: "#00B074", fontWeight: "bold", cursor: "pointer" }}
                        onClick={openRegisterModal}
                      >
                        {t('btn.btnSignUpNow')}
                      </a>
                      {/* <Link to="/register" style={{ color: "#00B074", fontWeight: "bold" }}>Đăng ký ngay</Link> */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




      {isRegisterModalOpen && (
        <div id="modal" className="modal">
          <div className="modal-content" style={{textAlign: 'center'}}>
            <div className="modal-title">
              <h2>{t('login.hello')},</h2>
            </div>
            <span>{t('register.welcome')} <i className="bi bi-bell" style={{ color: "yellow" }}></i></span>
            <span>{t('register.welcome1')} <br />
            {t('register.welcome2')}</span>
            <div className="modal-body  p-0">
              <div className="modal-section">
                <img
                  src="https://tuyendung.topcv.vn/app/_nuxt/img/bussiness.efbec2d.png"
                  className="bussiness-image"
                  alt="Business Image"
                />
                <br />
                {/* <button className="btnUser">Employer</button> */}
                <Link to="/registerForEmployer" className="btnUser">{t('register.employer')}</Link>

              </div>
              <div className="modal-section">
                <img
                  src="https://tuyendung.topcv.vn/app/_nuxt/img/student.c1c39ee.png"
                  className="bussiness-image"
                  alt="Student Image"
                />
                <br />
                <Link to="/registerForCandidate" className="btnUser">{t('register.candidate')}</Link>
              </div>

            </div>
            <div className="modal-section p-0">
              <button className="btnClose" onClick={closeRegisterModal}>{t('btn.btnClose')}</button>
            </div>
          </div>
        </div>
      )}


      {isForgetModalOpen && (
        <div id="modal" className="modal">
          <div className="modal-content" style={{textAlign : 'center'}}>
            <div className="modal-title">
              <h2>{t('login.hello')},</h2>
            </div>
            <span>{t('forget.welcome')} <i className="bi bi-bell" style={{ color: "yellow" }}></i></span>
            <hr />
            <div className="modal-body">
              <div className="card shadow w-100">
                <div className="card-body p-0">
                  <div className="">
                    <Link to="/home">
                      <img src="/logo.png" className="mb-4" style={{ width: '20%', height: '20%' }} alt="logo-icon" />
                    </Link>
                    <h3 className="mb-1 fw-bold">{t('forget.welcome1')}</h3>

                    <p className="text-danger">{errorResetPassword}</p>
                  </div>
                  <form method="post" onSubmit={handleForgetPassWordSubmit}>
                    <div className="m-2">
                      <input
                        type="email"
                        id="email_resetPassword"
                        className="form-control"
                        name="email"
                        placeholder={t('placeholders.email')}
                        required
                      />
                    </div>
                    <div className="mb-3 d-grid">
                      <button type="submit" className="btn btn-primary">
                      {t('btn.btnResetPass')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <button className="btnClose" onClick={closeForgetModal}>
            {t('btn.btnClose')}
            </button>
          </div>
        </div>
      )}


      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
        <div
          className={`toast ${showToast ? "show" : ""}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">{t('showToastMessage.status')}</strong>
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
