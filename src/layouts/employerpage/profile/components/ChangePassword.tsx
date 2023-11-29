import { useState } from "react";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { useAuth } from "../../../utils/AuthProvide";
import { useTranslation } from 'react-i18next';

export const ChangePassword = () => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [errorChangingPassword, setErrorChangingPassword] = useState("");
    const [successChangingPassword, setSuccessChangingPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChangePassWordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const currentPassword = (document.getElementById("currentPassword") as HTMLInputElement).value;
        const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
        const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;

        if (newPassword.length < 6) {
            setErrorChangingPassword(t('formErrors.invalidPassword'))
        }
        else if (
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
                newPassword
            )
        ) {
            setErrorChangingPassword(t('formErrors.invalidPassword'))
        }
        else if (newPassword === currentPassword) {
            setErrorChangingPassword(t('formErrors.currentMatchNewPass'));
        }

        else if (newPassword !== confirmPassword) {
            setErrorChangingPassword(t('formErrors.notMatchPassword'))
        }
        else {
            try {
                const response = await fetch(`http://localhost:8080/auth/profile/changePassword`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`, // Add the token here
                    },
                    body: JSON.stringify({
                        currentPassword: currentPassword,
                        newPassword: newPassword,
                    }),

                });

                if (response.ok) {
                    const data = await response.text();
                    setIsLoading(false);
                    setErrorChangingPassword("")
                    setSuccessChangingPassword(data)


                } else {
                    const data = await response.text();
                    setIsLoading(false);
                    setSuccessChangingPassword("")
                    setErrorChangingPassword(data);
                }

            } catch (error) {
                setErrorChangingPassword("Network error occurred");
                setSuccessChangingPassword("");
            } finally {
                setIsLoading(false);
            }
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <SpinnerLoading />
        );
    }

    return (
        <>
            <form method="POST" onSubmit={handleChangePassWordSubmit} className="row g-3 mt-4 needs-validation  d-flex flex-column justify-content-center align-items-center">
                <div className="col-md-8 ">
                    <label htmlFor="currentPassword" className="form-label">{t('placeholders.currentPassword')}</label>
                    <div className="mb-3 input-group">
                        <input
                            type="password"
                            id="currentPassword"
                            className="form-control"
                            name="currentPassword"
                            required
                        />

                    </div>
                </div>
                <div className="col-md-8">

                    <label htmlFor="currentPassword" className="form-label">{t('placeholders.newPassword')}</label>
                    <div className="mb-3 input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            className="form-control"
                            name="newPassword"
                            required
                        />

                        <span className="input-group-text" onClick={togglePasswordVisibility}>
                            <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                        </span>
                    </div>
                </div>
                <div className="col-md-8">
                    <label htmlFor="confirmPassword" className="form-label">{t('placeholders.confirmNewPassword')}</label>
                    <div className="mb-3 input-group">
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            name="confirmPassword"
                            required
                        />
                    </div>
                </div>
                {errorChangingPassword.length > 0 && (
                    <p className="text-danger text-center">{errorChangingPassword}</p>
                )}
                {successChangingPassword.length > 0 && (
                    <p className="text-success text-center">{successChangingPassword}</p>
                )}
                <div className="col-md-8 mt-4 text-center">
                    <button className="btn btn-primary p-3" type="submit">
                        {t('btn.btnChangePassword')}
                    </button>
                </div>
            </form>
        </>
    );
}