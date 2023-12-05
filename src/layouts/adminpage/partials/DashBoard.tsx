import { useState, useEffect } from "react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Page404 } from "../../errors/Page404";
import { BarChart } from "@mui/x-charts/BarChart";
import { ProfileModel } from "../../../models/ProfileModel";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { LineChart } from "@mui/x-charts";
const Dashboard = () => {
  const token: any = localStorage.getItem("jwt_token");
  const { t } = useTranslation();
  // Handle loading + Errors
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);
  const [totalCandidate, setTotalCandidate] = useState("");
  const [totalEmployer, setTotalEmployer] = useState("");
  const [totalJob, setTotalJob] = useState("");
  const [totalBlog, setTotalBlog] = useState("");
  const [totalContact, setTotalContact] = useState("");
  const [totalCandidateByMonth, setTotalCandidateByMonth] = useState([0]);
  const [totalEmployerByMonth, setTotalEmployerByMonth] = useState([0]);
  const [totalApplicantByMonth, setTotalApplicantByMonth] = useState([0]);
  const [totalJobByMonth, setTotalJobByMonth] = useState([0]);
  const [employer, setEmployer] = useState<ProfileModel[]>();

  const [yearUser, setYearUser] = useState("2023");
  const [yearJob, setYearJob] = useState("2023");

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const baseUrl = "http://localhost:8080/auth/admin/totalAdminPage";
        const response = await fetch(baseUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your actual authorization token
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTotalEmployer(data.totalEmployer);
          setTotalCandidate(data.totalCandidate);
          setTotalJob(data.totalJob);
          setTotalBlog(data.totalBlog);
          setTotalContact(data.totalContact);
        } else {
          console.error("Failed to fetch");
        }
      } catch (error: any) {
        setHttpError(error.message);
      }
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    const fetchTotalUserByMonth = async () => {
      try {
        const baseUrl =
          `http://localhost:8080/auth/admin/getQuantityUserByMonth?yearUser=${yearUser}&yearJob=${yearJob}`;
        const response = await fetch(baseUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your actual authorization token
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTotalCandidateByMonth(data.candidateMap);
          setTotalEmployerByMonth(data.employerMap);
          setTotalApplicantByMonth(data.applicantMap);
          setTotalJobByMonth(data.jobMap);
        } else {
          console.error("Failed to fetch");
        }
      } catch (error: any) {
        setHttpError(error.message);
      }
    };
    fetchTotalUserByMonth();
    fetchLastedEmployer();
  }, [yearUser, yearJob]);

  const fetchLastedEmployer = async () => {
    try {
      const baseUrl = `http://localhost:8080/auth/admin/lastedUser`;
      const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const profileList: ProfileModel[] = [];
        data.forEach((profileData: any) => {
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
          profileList.push(profile);
        });
        setEmployer(profileList);
        console.log(data);
      } else {
        console.error("Failed to fetch");
      }
    } catch (error: any) {
      setHttpError(error.message);
    }
  };

  const fetchData = async (year: any) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/admin/access-count/${year}`);
      const result = await response.json();
      console.log(result);
      setChartData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);


  const handleYearChange = (e: any) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
  };


  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <Page404 error={httpError} />;
  }

  const candidateData: { month: number; value: number }[] = [];
  for (const key in totalCandidateByMonth) {
    if (totalCandidateByMonth.hasOwnProperty(key)) {
      const item = {
        month: parseInt(key),
        value: totalCandidateByMonth[key],
      };
      candidateData.push(item);
    }
  }
  const employerData: { month: number; value: number }[] = [];
  for (const key in totalEmployerByMonth) {
    if (totalEmployerByMonth.hasOwnProperty(key)) {
      const item = {
        month: parseInt(key),
        value: totalEmployerByMonth[key],
      };
      employerData.push(item);
    }
  }
  const applicantData: { month: number; value: number }[] = [];
  for (const key in totalApplicantByMonth) {
    if (totalApplicantByMonth.hasOwnProperty(key)) {
      const item = {
        month: parseInt(key),
        value: totalApplicantByMonth[key],
      };
      applicantData.push(item);
    }
  }
  const jobData: { month: number; value: number }[] = [];
  for (const key in totalJobByMonth) {
    if (totalJobByMonth.hasOwnProperty(key)) {
      const item = {
        month: parseInt(key),
        value: totalJobByMonth[key],
      };
      jobData.push(item);
    }
  }
  const xLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    <>
      {/* Sale & Revenue Start */}
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-sm-6 col-xl-3">
            <Link to="/candidate">
              <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <i className="fa fa-user fa-3x text-success"></i>
                <div className="ms-1">
                  <p className="mb-2 fw-bold text-success">{t('dashboard.totalCandidate')}</p>
                  <h4 className="mb-0">{totalCandidate}</h4>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-sm-6 col-xl-3">
            <Link to="/employer/approvedEmployer">
              <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <i className="fa fa-clipboard fa-3x text-primary"></i>
                <div className="ms-1">
                  <p className="mb-2 fw-bold text-success">{t('dashboard.employer')}</p>
                  <h4 className="mb-0">{totalEmployer}</h4>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-sm-6 col-xl-2">
            <Link to="/job/approvedJob">
              <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <i className="fa fa-chart-area fa-3x text-warning"></i>
                <div className="ms-1">
                  <p className="mb-2 fw-bold text-success">{t('dashboard.jobs')}</p>
                  <h4 className="mb-0">{totalJob}</h4>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-sm-6 col-xl-2">
            <Link to="/blog/approvedBlog">
              <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <i className="fa fa-chart-pie fa-3x text-info"></i>
                <div className="ms-0">
                  <p className="mb-2 fw-bold text-success">{t('dashboard.blogs')}</p>
                  <h4 className="mb-0">{totalBlog}</h4>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-sm-6 col-xl-2">
            <Link to="/contact/openContact">
              <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <i className="fa fa-chart-pie fa-3x text-danger"></i>
                <div className="ms-0">
                  <p className="mb-2 fw-bold text-success">{t('dashboard.contacts')}</p>
                  <h4 className="mb-0">{totalContact}</h4>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* Sale & Revenue End */}

      {/* User Chart Start */}
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-sm-12 col-xl-12">
            <div className="bg-light text-center rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="mb-0 fw-bold text-success">{t('dashboard.statisticsAccess')}</h6>
                <div className="col-3">
                  <select
                    className="form-control"
                    id="selectMonth"
                    value={selectedYear} onChange={handleYearChange}
                  >
                    <option value={2018}>2018</option>
                    <option value={2019}>2019</option>
                    <option value={2020}>2020</option>
                    <option value={2021}>2021</option>
                    <option value={2022}>2022</option>
                    <option value={2023}>2023</option>
                    <option value={2024}>2024</option>
                  </select>
                </div>
              </div>
              <div className="row">
                {chartData.length > 0 ? (
                  <LineChart
                    width={1000}
                    height={500}
                    series={[{ data: chartData }]}
                    xAxis={[{ scaleType: "point", data: xLabels }]}
                  />
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-sm-12 col-xl-12">
            <div className="bg-light text-center rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="mb-0 fw-bold text-success">{t('dashboard.statisticsUser')}</h6>
                <div className="col-3">
                  <select
                    className="form-control"
                    id="selectMonth"
                    value={yearUser}
                    onChange={(e) => setYearUser(e.target.value)}
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
              </div>
              <div className="row">
                <BarChart
                  height={500}
                  series={[
                    {
                      data: candidateData.map((item) => item.value),
                      label: t('dashboard.candidate'),
                      id: "pvId",
                      color: "#198754"
                    },
                    {
                      data: employerData.map((item) => item.value),
                      label: t('dashboard.employer'),
                      id: "uvId",
                    },
                  ]}
                  xAxis={[{ data: xLabels, scaleType: "band" }]}

                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sales Chart End */}

      {/* Job and applicant chart start */}
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-sm-12 col-xl-12">
            <div className="bg-light text-center rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="mb-0 fw-bold text-success">{t('dashboard.statisticsJob')}</h6>
                <div className="col-3">
                  <select
                    className="form-control"
                    id="selectMonth"
                    value={yearJob}
                    onChange={(e) => setYearJob(e.target.value)}
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
              </div>
              <div className="row">
                <BarChart
                  height={500}
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
                      color: "#ffc107 "
                    },
                  ]}
                  xAxis={[{ data: xLabels, scaleType: "band" }]}

                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Job and applicant chart end */}

      {/* Recent Sales Start */}
      <div className="container-fluid pt-4 px-4 pb-5">
        <div className="bg-light text-center rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0 fw-bold text-success">{t('dashboard.recentEmployer')}</h6>
          </div>
          <div className="table-responsive">
            <table className="table text-start align-middle table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th >{t('dashboard.logo')}</th>
                  <th >{t('dashboard.companyName')}</th>
                  <th >{t('Email')}</th>
                  <th >{t('dashboard.phone')}</th>
                  <th >{t('dashboard.address')}</th>
                  <th >{t('dashboard.tax')}</th>
                </tr>
              </thead>
              <tbody>
                {employer &&
                  employer.map((e, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={e.companyLogo}
                          alt=""
                          style={{ width: "50px", height: "50px", objectFit: "contain" }}

                        />
                      </td>
                      <td>{e.companyName}</td>
                      <td>{e.email}</td>
                      <td>{e.phoneNumber}</td>
                      <td>{e.address}</td>
                      <td>{e.taxNumber}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Recent Sales End */}

      {/* Widgets Start */}
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4"></div>
      </div>
      {/* Widgets End */}
    </>
  );
};

export default Dashboard;
