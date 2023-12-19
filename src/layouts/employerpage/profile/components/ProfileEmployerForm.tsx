import Multiselect from "multiselect-react-dropdown"
import { useAuth } from "../../../utils/AuthProvide";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { ProfileModel } from "../../../../models/ProfileModel";
import { useTranslation } from 'react-i18next';

export const ProfileEmployerForm: React.FC<{ profile?: ProfileModel, updateProfile: any }> = (props) => {
    const { t } = useTranslation();

    const { user } = useAuth();
    const token = localStorage.getItem("jwt_token")
    const [specializationOptions, setSpecializationOptions] = useState([]);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");




    interface FormData {
        name: string;
        companyName: string;
        phoneNumber: string;
        address: string;
        bio: string;
        taxNumber: string;

    }


    const [formData, setFormData] = useState({
        name: props.profile?.userName || "",
        phoneNumber: props.profile?.phoneNumber || "",
        companyName: props.profile?.companyName || "",
        address: props.profile?.address || "",
        bio: props.profile?.bio || "",
        taxNumber: props.profile?.taxNumber || "",
    });

    const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

    const validateForm = () => {
        let errors: Partial<FormData> = {};
        let isValid = true;

        if (formData.name.trim().length < 3) {
            errors.name = t('formErrors.nameLength');
            isValid = false;
        }
        if (formData.companyName.trim().length < 3) {
            errors.companyName = t('formErrors.companyLength');
            isValid = false;
        }
        if (!/^0\d{9}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = t('formErrors.phoneInvalid');
            isValid = false;
        }
        if (formData.address.trim().length < 5) {
            errors.address = t('formErrors.invalidAddress');
            isValid = false;
        }
        if (formData.bio.trim().length < 20) {
            errors.bio = t('formErrors.invalidBio');
            isValid = false;
        }
        if (!/^0\d{9}$/.test(formData.phoneNumber)) {
            errors.taxNumber = t('formErrors.invalidTax');
            isValid = false;
        }


        setFormErrors(errors);
        return isValid;
    };


    useEffect(() => {
        const fetchSpe = async () => {
            const speResponse = await fetch("http://localhost:8080/api/specializations", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (speResponse.ok) {
                const speData = await speResponse.json();
                const specializations = speData._embedded.specializations;
                setSpecializationOptions(specializations.map((specialization: any) => specialization.specializationName));
            }
        }
        fetchSpe();
    }, [])

    useEffect(() => {
        if (props.profile?.specializationNames) {
            setSelectedValues(props.profile.specializationNames);
        }
    }, []);

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



    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const isValid = validateForm();

        if (isValid) {
            const newData = {
                userName: formData.name,
                phoneNumber: formData.phoneNumber,
                companyName: formData.companyName,
                taxNumber: formData.taxNumber,
                address: formData.address,
                bio: formData.bio,
            };
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
                            name: formData.name,
                            companyName: formData.companyName,
                            phoneNumber: formData.phoneNumber,
                            address: formData.address,
                            bio: formData.bio,
                            taxNumber: formData.taxNumber,
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
        setShowToast(true);
        setMessage(message);
        setTimeout(() => setShowToast(false), 3000);
    };

    if (isLoading) {
        return (
            <SpinnerLoading />
        );
    }
    return (
        <>

            <div className="col-lg-8">
                <div className="card">
                    <form method="PUT" onSubmit={handleSubmit} className="row needs-validation ms-2">
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-sm-3 d-flex align-items-center">
                                    <h6 className="mb-0">{t('placeholders.email')}</h6>
                                </div>
                                <div className="col-sm-9 text-secondary">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder={t('placeholders.email')}
                                        value={props.profile?.email}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-3 d-flex align-items-center">
                                    <h6 className="mb-0">{t('placeholders.name')}</h6>
                                </div>
                                <div className="col-sm-9 text-secondary">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder={t('placeholders.name')}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.name ?
                                        <label htmlFor="name">  <span className="error-message text-danger">{formErrors.name}</span></label> : " "
                                    }
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-3 d-flex align-items-center">
                                    <h6 className="mb-0">{t('placeholders.companyName')}</h6>
                                </div>
                                <div className="col-sm-9 text-secondary">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="companyName"
                                        placeholder={t('placeholders.companyName')}
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.companyName ?
                                        <label htmlFor="companyName">  <span className="error-message text-danger">{formErrors.companyName}</span></label> : ""
                                    }
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-3 d-flex align-items-center">
                                    <h6 className="mb-0">{t('placeholders.taxNumber')}</h6>
                                </div>
                                <div className="col-sm-9 text-secondary">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="taxNumber"
                                        placeholder={t('placeholders.taxNumber')}
                                        value={formData.taxNumber}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.taxNumber ?
                                        <label htmlFor="taxNumber">  <span className="error-message text-danger">{formErrors.taxNumber}</span></label> : ""
                                    }
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-3 d-flex align-items-center">
                                    <h6 className="mb-0">{t('placeholders.phoneNumber')}</h6>
                                </div>
                                <div className="col-sm-9 text-secondary">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phoneNumber"
                                        placeholder={t('placeholders.phoneNumber')}
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.phoneNumber ?
                                        <label htmlFor="phoneNumber">  <span className="error-message text-danger">{formErrors.phoneNumber}</span></label> : ""
                                    }
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-3 d-flex align-items-center">
                                    <h6 className="mb-0">{t('placeholders.address')}</h6>
                                </div>
                                <div className="col-sm-9 text-secondary">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        placeholder={t('placeholders.address')}
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.address ?
                                        <label htmlFor="address">  <span className="error-message text-danger">{formErrors.address}</span></label> : ""
                                    }
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-sm-3 d-flex align-items-center">
                                    <h6 className="mb-0">{t('placeholders.bio')}</h6>
                                </div>
                                <div className="col-sm-9 text-secondary">
                                    <textarea
                                        rows={4}
                                        cols={20}
                                        className="form-control" style={{ height: 'unset' }}
                                        name="bio"
                                        placeholder={t('placeholders.bio')}
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                    ></textarea>
                                    {formErrors.bio ?
                                        <label htmlFor="bio">  <span className="error-message text-danger">{formErrors.bio}</span></label> : ""
                                    }

                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-3 d-flex align-items-center">
                                    <h6 className="mb-0">{t('placeholders.specialization')}</h6>
                                </div>
                                <div className="col-sm-9 text-secondary">
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

                            <div className="row p-1">
                                <div className="col-sm-3 d-flex align-items-center"></div>
                                <div className="col-sm-9 text-secondary">
                                    <input type="submit" className="btn btn-primary p-2" value={t('btn.btnUpdateProfile')} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                {showToast && (
                    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
                        <div
                            className={`toast ${showToast ? "show" : ""}`}
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header" style={{ backgroundColor: "#198754", color: "white" }}>
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
                )}
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

}