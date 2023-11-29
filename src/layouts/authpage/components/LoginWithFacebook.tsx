import jwt_decode from "jwt-decode";
import { useState } from "react";
import FacebookLogin  from "react-facebook-login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvide";

export const LoginWithFacebook = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const responseFacebook = async (credentialResponse: any) => {
    console.log(credentialResponse);
    setIsLoading(true);
    if (credentialResponse !== null) {
      const name = credentialResponse.name;
      const email = credentialResponse.email;
      const userId = credentialResponse.id;

      const picture = `https://graph.facebook.com/${userId}/picture?type=large`;
      try {
        const response = await fetch(
          "http://localhost:8080/auth/loginWithGoogleAndFacebook",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              email: email,
              picture: picture,
            }),
          }
        );

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
  };

  return (
    <>
      <FacebookLogin
        appId="333616412587013"
        fields="name,email,picture"
        callback={responseFacebook}
        // icon="bi bi-facebook" 
        cssClass="btn custom-facebook-button"
      />

      <style>
        {`
                        .custom-facebook-button {
                            background-color: #3b5998;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            display: flex;
                            align-items: center;
                            /* Add more styles as needed */
                        }
                    `}
      </style>
    </>
  );
};
