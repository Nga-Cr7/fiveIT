import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthProvide';

export const LoginWithGoogle = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const handleSuccessLoginWithGoogle = async (credentialResponse: any) => {
        setIsLoading(true)
        if (credentialResponse !== null) {
            const credentialResponseDecoded: any = jwt_decode(credentialResponse.credential);
            // console.log(credentialResponseDecoded);
            const name = credentialResponseDecoded.name;
            const email = credentialResponseDecoded.email;
            const picture = credentialResponseDecoded.picture;

            console.log(name, email, picture)

            try {
                const response = await fetch("http://localhost:8080/auth/loginWithGoogleAndFacebook", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        picture: picture,
                    }),
                });

                if (response.ok) {
                    const responseToken = await response.json();
                    console.log(responseToken);
                    const token = responseToken.accessToken;
                    const decodedToken: any = jwt_decode(token);
                    const name = decodedToken.sub;
                    const role = decodedToken.role;
                    login(token, name, role);
                    // // eslint-disable-next-line no-lone-blocks
                    if (role === "admin") {
                        navigate("/dashboard");
                    } else if (role === "employer") {
                        navigate("/employerDashboard");
                    } else if (role === "candidate") {
                        navigate("/home");
                    }
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                    console.log("Error");
                }
            } catch (error) {
                console.log("Network error:", error);
            } finally {
                setIsLoading(false);
            }
        }
        setIsLoading(false);
    }


    return (
        <>
            <GoogleOAuthProvider clientId="20728699220-t6nqkg0ctkh2qm5v5o141espit95bd5v.apps.googleusercontent.com">
                <GoogleLogin

                    onSuccess={handleSuccessLoginWithGoogle}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                    
                />
            </GoogleOAuthProvider>

            
        </>

    )
}

