import style from "../css/style.module.css";
import { useAuth } from "../../utils/AuthProvide";
import { ProfileModel } from "../../../models/ProfileModel";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { useTranslation } from 'react-i18next';
export const ProfileCandidateForm: React.FC<{ profile?: ProfileModel, updateProfile: any }> = (
  props
) => {
  const { user } = useAuth();
  const token = localStorage.getItem("jwt_token");
  const [specializationOptions, setSpecializationOptions] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  interface FormData {
    fullName: string;
    // email: string;
    phoneNumber: string;
    address: string;
    bio: string;

  }

  const [formData, setFormData] = useState({
    fullName: props.profile?.userName || "",
    gender: props.profile?.gender || "",
    phoneNumber: props.profile?.phoneNumber || "",
    address: props.profile?.address || "",
    bio: props.profile?.bio || "",
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    let errors: Partial<FormData> = {};
    let isValid = true;
    const phoneNumberRegex = /^\d+$/;

    if (formData.fullName.trim().length < 3) {
      errors.fullName = t('formErrors.nameLength');
      isValid = false;
    }
    if (formData.phoneNumber.length < 10 || formData.phoneNumber.trim().length > 12 || !phoneNumberRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = t('formErrors.phoneInvalid');
      isValid = false;
    }
    if (formData.address.trim().length < 5) {
      errors.address = t('formErrors.invalidAddress');
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  useEffect(() => {
    const fetchSpecializations = async () => {
      const speResponse = await fetch(
        "http://localhost:8080/api/specializations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (speResponse.ok) {
        const speData = await speResponse.json();
        const specializations = speData._embedded.specializations;
        setSpecializationOptions(
          specializations.map(
            (specialization: any) => specialization.specializationName
          )
        );
      }

    };

    fetchSpecializations();
  }, [token]);

  useEffect(() => {
    if (props.profile?.specializationNames) {
      setSelectedValues(props.profile.specializationNames);
    }
  }, [props.profile?.specializationNames]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };


  const onRemove = (event: any) => {
    setSelectedValues(event);
  }

  const onSelect = (event: any) => {
    setSelectedValues(event);
  }

  // Add a useEffect to log the updated selectedValues



  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      const newData = { userName: formData.fullName, phoneNumber: formData.phoneNumber, address: formData.address, bio: formData.bio };
      props.updateProfile(newData);

      setIsLoading(true);
      setTimeout(async () => {
        try {
          const response = await fetch("http://localhost:8080/auth/profile/updateProfile", {
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
              specializationNames: selectedValues
            }),
          });

          if (response.ok) {
            setIsLoading(false);
            showToastMessage(t('showToastMessage.successUpdateProfile'));
          } else {
            setIsLoading(false);
            showToastMessage(t('showToastMessage.errorUpdateProfile'));

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
    return (
      <SpinnerLoading />
    );
  }

  return (
    <>
      <div className="row">
        <form method="PUT" onSubmit={handleSubmit}>
          <div className="row ms-4">
            <div className="col-md-6">
              <div className="row mt-3">
                <div className="col-md-12">
                  <h5 className={style.h5}>{t('placeholders.fullName')}</h5>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder={t('placeholders.fullName')}
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  {formErrors.fullName ?
                    <label htmlFor="fullname">  <span className="error-message text-danger">{formErrors.fullName}</span></label> : ""
                  }
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <h5 className={style.h5}>{t('placeholders.gender.gender')}</h5>
                  <select
                    name="gender"
                    className="form-control"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">{t('placeholders.gender.male')}</option>
                    <option value="Female">{t('placeholders.gender.female')}</option>
                    <option value="Others">{t('placeholders.gender.others')}</option>
                  </select>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <h5 className={style.h5}>{t('placeholders.phoneNumber')}</h5>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    placeholder={t('placeholders.phoneNumber')}
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                  {formErrors.phoneNumber ?
                    <label htmlFor="phonenumber"><span className="error-message text-danger">{formErrors.phoneNumber}</span></label> : ""
                  }
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <h5 className={style.h5}>{t('placeholders.email')}</h5>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder={t('placeholders.email')}
                    value={props.profile?.email}
                    readOnly
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <h5 className={style.h5}>{t('placeholders.address')}</h5>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder={t('placeholders.address')}
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  {formErrors.address ?
                    <label htmlFor="address">   <span className="error-message text-danger">{formErrors.address}</span></label> : ""
                  }
                </div>
              </div>

            </div>

            <div className="col-md-6">
              <div className="row mt-3">
                <div className="col-md-12">
                  <h5 className={style.h5}>{t('placeholders.specialization')}</h5>
                  <Multiselect
                    className='multiselect_value'
                    isObject={false}
                    options={specializationOptions}
                    selectedValues={selectedValues}
                    placeholder={t('placeholders.chooseSpecialization')}
                    onRemove={onRemove}
                    onSelect={onSelect}
                    showCheckbox
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <h5 className={style.h5}>{t('placeholders.bio')}</h5>
                  <textarea
                    rows={4}
                    cols={10}
                    className="form-control"
                    name="bio"
                    placeholder={t('placeholders.bio')}
                    value={formData.bio}
                    onChange={handleInputChange}
                  ></textarea>

                </div>
              </div>
            </div>
            <div className="row mt-3 justify-content-center">
              <div className="row mt-4">
                <button className="btn btn-success profile-button" type="submit">
                  {t('btn.btnUpdateProfile')}
                </button>
              </div>
            </div>
          </div>
        </form>

      </div>
      <div className="position-fixed bottom-0 end-0 p-3 toast-message" style={{ zIndex: 5 }}>
        <div
          className={`toast ${showToast ? "show" : ""}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header" style={{ backgroundColor: '#198754', color: 'white' }}>
            <strong className="me-auto">{t('showToastMessager.status')}</strong>
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

      <style>
        {`
          span.chip.false.false {
            color: white !important;
            background: #198754 !important;
          }

          .multiSelectContainer li:hover {
            background-color: #198754 !important;
          }

          li.option.highlightOption.highlight{
            background: #198754 !important;
          }
        `}
      </style>
    </>
  );
};
