import { useDropzone } from "react-dropzone";
import { ProfileModel } from "../../../../models/ProfileModel";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { useTranslation } from 'react-i18next';




export const ProfileLogoImg: React.FC<{ profile?: ProfileModel, onProfileUpdate: any }> = (props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [companyLogoURL, setCompanyLogoURL] = useState("");
  const [companyFileName, setCompanyFileName] = useState("");

  const [companyImg1URL, setCompanyImg1URL] = useState("");
  const [companyImg2URL, setCompanyImg2URL] = useState("");
  const [companyImg3URL, setCompanyImg3URL] = useState("");



  const ImageDropZone: React.FC<{
    imgSrc: string | null;
    handleImageUpload: (files: File[]) => void;
    index: number;
  }> = ({ imgSrc, handleImageUpload, index }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles: File[]) => handleImageUpload(acceptedFiles)
    });

    return (
      <div {...getRootProps()} key={index}>
        <input {...getInputProps()} />
        <img
          src={imgSrc || "https://res.cloudinary.com/dzqoi9laq/image/upload/v1701858488/a_zbxuz8.jpg"}
          className="p-1"
          alt={`Company ${index + 1}`}
          style={{
            width: "80px",
            height: "60px",
            border:"solid green 2px ",
          }}
        />
      </div>
    );
  };




  useEffect(() => {
    if (props.profile?.companyLogo) {
      setCompanyLogoURL(props.profile.companyLogo);
    }
    if (props.profile?.companyImg1) {
      setCompanyImg1URL(props.profile.companyImg1);
    }
    if (props.profile?.companyImg2) {
      setCompanyImg2URL(props.profile.companyImg2);
    }
    if (props.profile?.companyImg3) {
      setCompanyImg3URL(props.profile.companyImg3);
    }
  }, []);


  const onCompanyLogoDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      if (selectedFile.type.startsWith("image/")) {
        setCompanyFileName(selectedFile.name);
      } else {
        alert("Wrong")
        if (!companyFileName) {
          setCompanyFileName("");
        }
        return;
      }
      const reader = new FileReader();

      reader.onload = () => {
        setCompanyLogoURL(reader.result as string);
        handleCompanyLogoUpload(selectedFile);
      };

      reader.readAsDataURL(selectedFile);

    }
  };


  const handleCompanyLogoUpload = async (selectedFile: File) => {
    setIsLoading(true); // Set loading to true before starting the upload process
    const formData = new FormData();
    formData.append("file", selectedFile);
    const token = localStorage.getItem("jwt_token");

    try {
      const response = await fetch(`http://localhost:8080/auth/profile/uploadAvtProfile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }



      const data = await response.text();
      const userImgUrl = data;
      const updatedProfile = {
        ...props.profile,
        companyLogo: userImgUrl,
      };
      setCompanyLogoURL(userImgUrl);
      if (props.onProfileUpdate) {
        props.onProfileUpdate(updatedProfile);
      }
    } catch (error) {
      console.log("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };




  const handleCompanyImg1Upload = (acceptedFiles: File[]) => {
    handleCompanyImgUpload(acceptedFiles[0], 0);
  };

  const handleCompanyImg2Upload = (acceptedFiles: File[]) => {
    handleCompanyImgUpload(acceptedFiles[0], 1);
  };

  const handleCompanyImg3Upload = (acceptedFiles: File[]) => {
    handleCompanyImgUpload(acceptedFiles[0], 2);
  };



  const handleCompanyImgUpload = async (selectedFile: File, index: number) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    const token = localStorage.getItem("jwt_token");

    try {
      const response = await fetch(`http://localhost:8080/auth/profile/uploadCompanyImg?imageIndex=${index}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.text();
      const companyImgUrl = data;

      let updatedProfile = { ...props.profile };
      let updatedImgStateFunction = setCompanyImg1URL; // Placeholder function

      switch (index) {
        case 0:
          updatedProfile = { ...updatedProfile, companyImg1: companyImgUrl };
          updatedImgStateFunction = setCompanyImg1URL;
          break;
        case 1:
          updatedProfile = { ...updatedProfile, companyImg2: companyImgUrl };
          updatedImgStateFunction = setCompanyImg2URL;
          break;
        case 2:
          updatedProfile = { ...updatedProfile, companyImg3: companyImgUrl };
          updatedImgStateFunction = setCompanyImg3URL;
          break;
        default:
          break;
      }

      updatedImgStateFunction(companyImgUrl); // Update the image URL state

      if (props.onProfileUpdate) {
        props.onProfileUpdate(updatedProfile); // Call the parent function with the updated profile
      }
    } catch (error) {
      console.log("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({ onDrop: onCompanyLogoDrop });

  if (isLoading) {
    return (
      <SpinnerLoading />
    );
  }

  return (
    <>
      <div className="col-lg-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-column align-items-center text-center">
              <div {...getImageRootProps()} className="row d-flex justify-content-center">
                <input {...getImageInputProps()} />
                {companyLogoURL && (
                  <img
                    src={companyLogoURL}
                    className="rounded-circle p-1"
                    alt="Company"
                    style={{
                      height: '120px',
                      width: '120px',
                      objectFit: 'contain',
                      cursor: 'pointer',
                      border: '2px #000 dotted'
                    }}
                  />
                )}
              </div>
              <div className="mt-3">
                <h6>{props.profile?.email}</h6>
                <p className="text-success fw-bold mb-1">{props.profile?.companyName}</p>
                <p className="text-muted font-size-sm">{props.profile?.address}</p>
              </div>
            </div>
            <hr className="my-4" />
            <p className="text-success fw-bold text-center mb-1"> {t('profile.companyImg')}</p>
            <div className="mt-3 d-flex justify-content-evenly">
              <ImageDropZone
                imgSrc={props.profile?.companyImg1 || companyImg1URL}
                handleImageUpload={handleCompanyImg1Upload}
                index={0}
              />
              <ImageDropZone
                imgSrc={props.profile?.companyImg2 || companyImg2URL}
                handleImageUpload={handleCompanyImg2Upload}
                index={1}
              />
              <ImageDropZone
                imgSrc={props.profile?.companyImg3 || companyImg3URL}
                handleImageUpload={handleCompanyImg3Upload}
                index={2}
              />
            </div>
            <p className="text-success text-center mt-2">{t('profile.dragOrClick')}</p>

            <hr />
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  className="feather feather-globe me-2 icon-inline">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path
                    d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                  </path>
                </svg>Website</h6>
                <span className="text-success">https://FiveITViec.com</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  className="feather feather-github me-2 icon-inline">
                  <path
                    d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22">
                  </path>
                </svg>Github</h6>
                <span className="text-success">FiveITViec</span>
              </li>

              <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  className="feather feather-instagram me-2 icon-inline text-danger">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>Instagram</h6>
                <span className="text-success">FiveITViec</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  className="feather feather-facebook me-2 icon-inline text-primary">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>Facebook</h6>
                <span className="text-success">FiveITViec</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>

  );
};
