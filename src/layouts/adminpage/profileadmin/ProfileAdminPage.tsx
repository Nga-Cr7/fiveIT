import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/AuthProvide";
import { ProfileModel } from "../../../models/ProfileModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { ChangePassword } from "./component/ChangePassword";
import { NewAccount } from "./component/NewAccount";

export const ProfileAdminPage: React.FC<{}> = (props) => {
  const { t } = useTranslation();

  const [adminName, setAdminName] = useState("John Doe");
  const [adminEmail, setAdminEmail] = useState("john.doe@example.com");
  const [adminRole, setAdminRole] = useState("Administrator");

  const updateAdminInfo = () => {
    // Add your code here to handle the form submission and update the admin information
    alert("Thông tin admin đã được cập nhật!");
  };

  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  interface FormData {
    fullName: string;
    // email: string;
    gender: string;
    phoneNumber: string;
    address: string;
    bio: string;
  }

  const [formData, setFormData] = useState({
    fullName: profile?.userName || "",
    gender: profile?.gender || "",
    phoneNumber: profile?.phoneNumber || "",
    address: profile?.address || "",
    bio: profile?.bio || "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/auth/profile/loadProfile",
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (response.ok) {
          const profileData = await response.json();
          const profile = new ProfileModel(
            profileData.profileType,
            profileData.name,
            profileData.email,
            profileData.userImage,
            profileData.userCv,
            profileData.gender,
            profileData.phoneNumber,
            profileData.address,
            profileData.bio,
            profileData.companyName,
            profileData.companyLogo,
            profileData.companyImg1,
            profileData.companyImg2,
            profileData.companyImg3,
            profileData.taxNumber,
            profileData.specializationNames, // Pass specialization names as an array
            profileData.favoriteJobs // Pass specialization names as an array
          );

          setFormData({
            fullName: profile.userName || "",
            gender: profile.gender || "",
            phoneNumber: profile.phoneNumber || "",
            address: profile.address || "",
            bio: profile.bio || "",
          });

          console.log(profile);
          setProfile(profile);
        }
      } catch (error) {
        console.log("Error fetching API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    let errors: Partial<FormData> = {};
    let isValid = true;
    const phoneNumberRegex = /^\d+$/;

    if (formData.fullName.trim().length < 3) {
      errors.fullName = t("formErrors.nameLength");
      isValid = false;
    }
    if (
      formData.phoneNumber.length < 10 ||
      formData.phoneNumber.trim().length > 12 ||
      !phoneNumberRegex.test(formData.phoneNumber)
    ) {
      errors.phoneNumber = t("formErrors.phoneInvalid");
      isValid = false;
    }
    if (formData.address.trim().length < 5) {
      errors.address = t("formErrors.invalidAddress");
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      // const newData = { userName: formData.fullName, phoneNumber: formData.phoneNumber, address: formData.address, bio: formData.bio };
      // props.updateProfile(newData);

      setIsLoading(true);
      setTimeout(async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/auth/profile/updateProfile",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`, // Add the token here
              },
              body: JSON.stringify({
                name: formData.fullName,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                bio: formData.bio,
              }),
            }
          );

          if (response.ok) {
            setIsLoading(false);
            showToastMessage(t("showToastMessage.successUpdateProfile"));
          } else {
            setIsLoading(false);
            showToastMessage(t("showToastMessage.errorUpdateProfile"));
          }
        } catch (error) {
          // Handle network error
        } finally {
          setIsLoading(false);
        }
      }, 2000);
    }
  };

  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (isLoading) {
    return <SpinnerLoading />;
  }

  return (
    <div className="container mt-5">
      {/* Nav tabs */}
      <ul className="nav nav-tabs" id="myTabs">
        <li className="nav-item">
          <a
            className="nav-link active text-success"
            id="info-tab"
            data-bs-toggle="tab"
            href="#info"
          >
            {t("profile.profile")}
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link text-success"
            id="password-tab"
            data-bs-toggle="tab"
            href="#password"
          >
            {t("profile.changePassword")}
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link text-success"
            id="create-admin-tab"
            data-bs-toggle="tab"
            href="#create-admin"
          >
            {t("profile.createNewAdmin")}
          </a>
        </li>
      </ul>

      {/* Tab content */}
      <div className="tab-content">
        {/* Tab 1: Information */}
        <div className="tab-pane fade show active" id="info">
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center mb-4">
                      <label htmlFor="fileInput" className="file-input-label">
                        <div
                          className="image-container"
                          style={{ position: "relative" }}
                        >
                          <img
                            src={
                              // editingCandidate.userImg ||
                              "https://res.cloudinary.com/dzqoi9laq/image/upload/v1699419757/logoo_pyz2sp.png"
                            }
                            alt="Candidate"
                            className="img-fluid rounded-circle"
                            style={{
                              width: "10em",
                              objectFit: "fill",
                              height: "150px",
                            }}
                          />
                        </div>
                      </label>
                    </div>
                    <form method="PUT" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                              {t("placeholders.fullName")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="fullName"
                              name="fullName"
                              placeholder={t("placeholders.fullName")}
                              value={formData.fullName}
                              onChange={handleInputChange}
                            />
                            {formErrors.fullName ? (
                              <label htmlFor="fullname">
                                {" "}
                                <span className="error-message text-danger">
                                  {formErrors.fullName}
                                </span>
                              </label>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="gender" className="form-label">
                              {t("placeholders.gender.gender")}
                            </label>
                            <select
                              name="gender"
                              className="form-control"
                              value={formData.gender}
                              onChange={handleInputChange}
                            >
                              <option value="Male">
                                {t("placeholders.gender.male")}
                              </option>
                              <option value="Female">
                                {t("placeholders.gender.female")}
                              </option>
                              <option value="Others">
                                {t("placeholders.gender.others")}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                              {t("placeholders.address")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="address"
                              name="address"
                              placeholder={t("placeholders.address")}
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                            {formErrors.address ? (
                              <label htmlFor="address">
                                {" "}
                                <span className="error-message text-danger">
                                  {formErrors.address}
                                </span>
                              </label>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                              {t("placeholders.phoneNumber")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="phoneNumber"
                              name="phoneNumber"
                              placeholder={t("placeholders.phoneNumber")}
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                            />
                            {formErrors.phoneNumber ? (
                              <label htmlFor="phonenumber">
                                <span className="error-message text-danger">
                                  {formErrors.phoneNumber}
                                </span>
                              </label>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Các trường thông tin khác ở đây */}
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="bio" className="form-label">
                              {t("placeholders.bio")}
                            </label>
                            <textarea
                              className="form-control"
                              id="bio"
                              name="bio"
                              rows={4}
                              value={formData.bio}
                              onChange={handleInputChange}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-success"
                        >
                          {t("btn.btnUpdate")}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 2: Change Password */}
        <div className="tab-pane fade pt-5" id="password">
          <div className="card">
            <div className="card-body">
              <ChangePassword />
            </div>
          </div>
        </div>

        {/* Tab 3: Create New Admin */}
        <div className="tab-pane fade pt-5" id="create-admin">
          <div className="card">
            <div className="card-body">
              <NewAccount />
            </div>
          </div>
        </div>
      </div>

      {showToast === true &&(

        <div
          className="position-fixed bottom-0 end-0 p-3 toast-message"
          style={{ zIndex: 5 }}
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
    </div>
  );
};
