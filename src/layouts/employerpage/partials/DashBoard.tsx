import { useEffect, useState } from "react";
// import "./components/apex-charts/apex-charts.css";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { BarChart } from "@mui/x-charts/BarChart";

export const Dashboard = () => {
  const token: any = localStorage.getItem("jwt_token");
  const [jobEnable, setJobEnable] = useState("");
  const [jobDisable, setJobDisable] = useState("");
  const [waitingCv, setWaitingCv] = useState("");
  const [approvedCv, setApprovedCv] = useState("");
  const [httpError, setHttpError] = useState(null);
  const [totalApplicant, setTotalApplicant] = useState([0]);
  const [totalJob, setTotalJob] = useState([0]);
  const [companyName, setCompanyName] = useState("");
  const img1 = "https://res.cloudinary.com/dzqoi9laq/image/upload/v1700546303/Unstatic2_kaj1rs.png"
  const img2 = "https://res.cloudinary.com/dzqoi9laq/image/upload/v1700546300/Unstatic1_cpcmcf.jpg"
  const img3 = "https://res.cloudinary.com/dzqoi9laq/image/upload/v1700544982/LG1_gyizgf.jpg"
  const [year, setYear] = useState("2023");
  const { t } = useTranslation();
  const applicantData: { value: number }[] = [];
  // if(totalApplicant.length<=0){}
  for (const key in totalApplicant) {
    if (totalApplicant.hasOwnProperty(key)) {
      const item = {
        value: totalApplicant[key],
      };
      applicantData.push(item);
    }
  }
  const jobData: { month: number; value: number }[] = [];
  for (const key in totalJob) {
    if (totalJob.hasOwnProperty(key)) {
      const item = {
        month: parseInt(key),
        value: totalJob[key],
      };
      jobData.push(item);
    }
  }
  const xLabels = [
    "JAN ",
    "FEB ",
    "MAR ",
    "APR",
    "MAY ",
    "JUN ",
    "JUL ",
    "AUG",
    "SEP ",
    "OCT ",
    "NOV",
    "DEC",
  ];

  const imgArray = [img1, img2, img3];

  // Function to get a random index
  function getRandomIndex(max: any) {
    return Math.floor(Math.random() * max);
  }

  // Get a random index to select a random image
  const randomIndex = getRandomIndex(imgArray.length);

  // Use the randomly selected image URL
  const randomImage = imgArray[randomIndex];

  // const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  // // Function to update the screen size state
  // const updateScreenSize = () => {
  //   setIsLargeScreen(window.innerWidth >= 768);
  // };

  // // useEffect to set up event listener on component mount
  // useEffect(() => {
  //   // Set up event listener for window resize
  //   window.addEventListener('resize', updateScreenSize);

  //   // Clean up event listener on component unmount
  //   return () => {
  //     window.removeEventListener('resize', updateScreenSize);
  //   };
  // }, []);



  useEffect(() => {
    const fetchTotalUserByMonth = async () => {
      try {
        const baseUrl = `http://localhost:8080/auth/employer/getQuantityJobAndCvByMonth?year=${year}`;
        const response = await fetch(baseUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your actual authorization token
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTotalApplicant(data.applicantMap);
          setTotalJob(data.jobMap);
          console.log(data);
        } else {
          console.error("Failed to fetch");
        }
      } catch (error: any) {
        setHttpError(error.message);
      }
    };
    fetchTotalUserByMonth();
    fetchTotal();
  }, [year]);

  const fetchTotal = async () => {
    try {
      const baseUrl = "http://localhost:8080/auth/employer/getTotalData";
      const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Replace with your actual authorization token
        },
      });
      if (response.ok) {
        const data = await response.json();
        setJobEnable(data.jobEnable);
        setJobDisable(data.jobDisable);
        setWaitingCv(data.cvWaiting);
        setApprovedCv(data.cvApproved);
        setCompanyName(data.companyName)
        console.log(companyName)
      } else {
        console.error("Failed to fetch");
      }
    } catch (error: any) {
      setHttpError(error.message);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href=".././././public/assets/libs/apex-charts/apex-charts.css"
      />
      <link rel="stylesheet" href="../assets/libs/fonts/boxicons.css" />
      <div className="container-fluid p-0">
        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
              <div className="col-lg-8 order-0">
                <div className="card">
                  <div className="d-flex align-items-end row">
                    <div className="col-sm-7">
                      <div className="card-body">
                        <h5 className="card-title text-primary">{t('dashboard.welcome')} <h5 className="text-danger d-inline">{companyName}</h5> 🎉</h5>
                        <p className="mb-4">
                          {t('dashboard.welcomeText')}
                        </p>

                        {/* <a href="javascript:;" className="btn btn-sm btn-outline-primary">View Badges</a> */}
                      </div>
                    </div>
                    <div className="col-sm-5 text-center text-sm-left">
                      <div className="card-body pb-0 px-0 px-md-4">
                        <img
                          src="../assets/img/illustrations/man-with-laptop-light.png"
                          height="140"
                          alt="View Badge User"
                          data-app-dark-img="illustrations/man-with-laptop-dark.png"
                          data-app-light-img="illustrations/man-with-laptop-light.png"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 order-1">
                <div className="row">
                  <div className="col-lg-6 col-md-12 col-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <i className="fa fa-chart-pie fa-3x text-primary"></i>
                        <span className="fw-semibold d-block mb-1">
                          {t('dashboard.waitingCv')}
                        </span>
                        <h3 className="card-title mb-2">{waitingCv}</h3>
                        {/* <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +72.80%</small> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <i className="fa fa-user fa-3x text-primary"></i>
                        <span className="fw-semibold d-block mb-1">{t('dashboard.approvedCv')}</span>
                        <h3 className="card-title mb-2">
                          {approvedCv}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
                <div className="card">
                  <div className="row row-bordered g-0">
                    <h5 className="card-header m-0 me-2 pb-3">{t('dashboard.statisticsJob')}</h5>
                    <div className="col-6 ms-3 mt-3">
                      <select
                        className="form-control"
                        id="selectMonth"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="2018">2018</option>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>
                    <div className={`col-md-12`}>
                      <BarChart
                      
                        // width={isLargeScreen ? 900 : 380}
                        height={380}
                        series={[
                          {
                            data: applicantData.map((item) => item.value),
                            label: t('dashboard.applicant'),
                            id: "pvId",
                          },
                          {
                            data: jobData.map((item) => item.value),
                            label: t('dashboard.job'),
                            id: "uvId",
                          },
                        ]}
                        xAxis={[{ data: xLabels, scaleType: "band" }]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
                <div className="row">
                  <div className="col-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <i className="fa fa-chart-area fa-3x text-primary"></i>
                        <span className="d-block mb-1">{t('dashboard.jobEnable')}</span>
                        <h3 className="card-title text-nowrap mb-2">
                          {jobEnable}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <i className="fa fa-chart-area fa-3x text-primary"></i>
                        <span className="fw-semibold d-block mb-1">
                          {t('dashboard.jobDisable')}
                        </span>
                        <h3 className="card-title mb-2">{jobDisable}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <div className="card-title">
                              <img src={randomImage} className="w-100 h-100" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-backdrop fade"></div>
        </div>
      </div>

      <style>
        {`
          .icon-small{
            width:38px;
            height:38px;
          } 

          
         
        `}
      </style>
    </>
  );
};
