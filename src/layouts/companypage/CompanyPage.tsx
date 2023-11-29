import { error } from "console";
import { JobCategoryModel } from "../../models/JobCategoryModel";
import { JobModel } from "../../models/JobModel";
import { Page404 } from "../errors/Page404";
import { Pagination } from "../utils/Pagination";
import { Company } from "./components/Company";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { useParams } from "react-router-dom";
import { CompanyBanner } from "./components/CompanyBanner";
import { UserManagementModel } from "../../models/UserManagementModel";
import { useTranslation } from 'react-i18next';

export function CompanyPage() {
  // Handle cateId for home
  const { t } = useTranslation();
  // Handle loading + Errors
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  // Handle search according to the search input
  const [search, setSearch] = useState("");

  const [selectedCate, setSelectedCate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Handle data for jobs and jobs category
  const [companys, setCompanys] = useState<UserManagementModel[]>([]);
  const [jobCate, setJobCate] = useState<JobCategoryModel[]>([]);
  const [location, setLocation] = useState<string[]>([]);

  // Handle pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [companyPerPage] = useState(4);
  const [totalPage, setTotalPage] = useState(0);

  //Handle Search
  const [searchUrl, setSearchUrl] = useState("");
  const [address, setAddress] = useState("");
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    const fetchCompany = async () => {
      let baseUrl = "";

      if (searchUrl === "") {
        baseUrl = `http://localhost:8080/api/company/getAllEmployerApproval?companyName=${search}&address=${address}&page=${currentPage - 1
          }&size=${companyPerPage}`;
      } else {
        let searchWithPage = searchUrl.replace(
          "<currentPage>",
          `${currentPage - 1}`
        );
        baseUrl = searchWithPage;
      }

      try {
        const response = await fetch(baseUrl);
        if (response.ok) {
          const data = await response.json();

          const loadedCompany: UserManagementModel[] = [];
          data.content.forEach((employerData: any) => {
            const employer = new UserManagementModel(
              employerData.profileType,
              employerData.userId,
              employerData.userName,
              employerData.email,
              employerData.status,
              employerData.approval,
              employerData.userImg,
              employerData.gender,
              employerData.phoneNumber,
              employerData.address,
              employerData.bio,
              employerData.companyName,
              employerData.companyLogo,
              employerData.taxNumber,
              employerData.specializationNames
            );

            loadedCompany.push(employer);
          });

          setCompanys(loadedCompany);
          setTotalPage(data.totalPages);
          setIsLoading(false);
        }
      } catch (error) {
        // Xử lý lỗi xảy ra trong quá trình fetch
        console.error("Lỗi trong quá trình fetch:", error);
      }
    };

    fetchCompany(); // Gọi hàm fetchCompany
  }, [currentPage, searchUrl]);

  useEffect(() => {
    const locationURL = "http://localhost:8080/provinces";

    try {
      const fetchData = () => {
        fetch(locationURL)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setLocation(data.map((item: any) => item.provinceName));
          })
          .catch((error) => {
            console.log("Error fetching data:", error);
          });
      };

      fetchData();
    } catch (error: any) {
      setIsLoading(false);
      setHttpError(error.message);
    }
  }, []);

  const searchHandleChange = (searchKey: string, address: string) => {
    setCurrentPage(1);
    setSearching(true);
    let newURL = `http://localhost:8080/api/company/getAllEmployerApproval?companyName=${searchKey}&address=${address}&page=<currentPage>&size=${companyPerPage}`;
    setSearchUrl(newURL);
    setTimeout(() => {
      setSearching(false);
    }, 300);
  };

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <Page404 error={httpError} />;
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <CompanyBanner />
      <div
        className="container-fluid bg-primary mb-3 wow fadeIn"
        data-wow-delay="0.1s"
        style={{ padding: "35px" }}
      >
        <div className="container">
          <div className="row g-2">
            <div className="col-md-12 ">
              <div className="row g-2  ">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder={t('searchForm.keyword')}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-md-5">
                  <select
                    className="form-select border-0"
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">{t('searchForm.location')}</option>
                    {location.map((loca, index) => (
                      <option key={index} value={loca}>
                        {loca}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-dark border-0 w-100"
                    onClick={() => searchHandleChange(search, selectedLocation)}
                    disabled={searching}
                    style={{ height: "auto", position: "relative" }}
                  >
                    {searching ? (
                      <>
                        <span style={{ visibility: "hidden" }}>{t('searchForm.searchBtn')}</span>
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <div
                            className="spinner-border text-light"
                            role="status"
                            style={{ width: "1.5rem", height: "1.5rem" }}
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {t('searchForm.searchBtn')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-xxl py-3">
        <div className="container">
          <h1 className="text-center mb-2 wow fadeInUp" data-wow-delay="0.1s">
            {t('company.company')}
          </h1>
          {companys.length === 0 ? (
            <div></div>
          ) : (
            <p className="text-center">
              {t('company.description')}
            </p>
          )}
          {companys.length > 0 ? (
            <>
              <section id="team" className="team section-bg">
                <div className="container" data-aos="fade-up">
                  <div className="row">
                    {companys.length > 0 &&
                      companys.map((companys) => (
                        <Company company={companys} key={companys.userId} />
                      ))}
                  </div>
                </div>
              </section>
              {totalPage >= 2 && (
                <div className="mt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPage={totalPage}
                    paginate={paginate}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="background">
                <strong>
                  {t('company.noCompany')}
                </strong>
              </div>
              <div>
                <img
                  style={{ maxWidth: "30%" }}
                  src="/assets/img/sorry.png"
                  className="img-fluid w-30 "
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
