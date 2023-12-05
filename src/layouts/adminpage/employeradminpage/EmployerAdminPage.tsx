import React, { ChangeEvent, useEffect, useState } from "react";
import { UserManagementModel } from "../../../models/UserManagementModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Page404 } from "../../errors/Page404";
import { Pagination } from "../../utils/Pagination";
import { useTranslation } from 'react-i18next';
import { BarChart } from "@mui/x-charts/BarChart";
import { CSVLink } from "react-csv";


export const EmployerAdminPage = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [employers, setEmployers] = useState<UserManagementModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employersPerPage] = useState(5);
  const [totalEmployers, setTotalEmployers] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchUrl, setSearchUrl] = useState("");
  const [search, setSearch] = useState("");
  const approval: string = 'APPROVED';
  const [editingEmployer, setEditingEmployer] = useState<UserManagementModel | null>(null);
  const [edit, setEdit] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("ENABLE");
  const [totalEmployerByMonth, setTotalEmployerByMonth] = useState([0]);
  const [year, setYear] = useState("2023");
  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const token: any = localStorage.getItem("jwt_token");

  const fetchAllEmployers = async () => {
    try {
      let baseUrlForJob = "";
      if (searchUrl === "") {
        baseUrlForJob = `http://localhost:8080/auth/admin/getAllEmployers?email=${search}&startDate=${startDate}&endDate=${endDate}&status=${searchStatus}&page=${currentPage - 1}&size=${employersPerPage}&approval=${approval}`;
      } else {
        let searchWithPage = searchUrl.replace("<currentPage>", `${currentPage - 1}`);
        baseUrlForJob = searchWithPage;
      }

      const response = await fetch(baseUrlForJob, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const loadedEmployers: UserManagementModel[] = [];
        data.content.forEach((employerData: any) => {
          const candidate = new UserManagementModel(
            employerData.profileType,
            employerData.userId,
            employerData.name,
            employerData.email,
            employerData.status,
            employerData.approval,
            null,
            null,
            employerData.phoneNumber,
            employerData.address,
            employerData.bio,
            employerData.companyName,
            employerData.companyLogo || null,
            employerData.taxNumber,
            employerData.companyImg1,
            employerData.companyImg2,
            employerData.companyImg3,
            employerData.specializationNames
          );

          loadedEmployers.push(candidate);
        });

        setEmployers(loadedEmployers);
        if (updated) {
          setCurrentPage(1);
          setUpdated(false);
        }
        setTotalEmployers(data.totalElements);
        setTotalPage(data.totalPages);
        setIsLoading(false);
      } else {
        throw new Error('Request failed');
      }
    } catch (error: any) {
      setHttpError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEmployers();
  }, [currentPage, searchUrl, updated]);

  const searchHandleChange = (
    searchKey: string,
    searchStartDate: string,
    searchEndDate: string,
    searchStatus: string,
  ) => {
    setCurrentPage(1);
    setEdit(false);
    setEditingEmployer(null);
    let newURL = `http://localhost:8080/auth/admin/getAllEmployers?email=${search}&page=<currentPage>&size=${employersPerPage}&approval=${approval}&startDate=${startDate}&endDate=${endDate}&status=${searchStatus}`;
    setSearchUrl(newURL);
  };

  const handleEditEmployer = (employer: UserManagementModel) => {
    setEditingEmployer(employer);
    setEdit(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smooth scrolling
    });
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.value;

    if (editingEmployer) {
      setEditingEmployer({
        ...editingEmployer,
        status: newStatus,
      });
    }
  };

  const handleCancel = () => {
    setEditingEmployer(null);
    setEdit(false);
  };

  const updateEmployerStatus = async () => {
    if (editingEmployer) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/auth/admin/updateCandidateStatus`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: editingEmployer.userId,
            status: editingEmployer.status,
            approval: 'APPROVED',
          }),
        });

        if (response.ok) {
          setUpdated(true);
          setIsLoading(false);
          showToastMessage(t('showToastMessage.updateSuccess'));
          handleCancel();
        } else {
          showToastMessage(t('showToastMessage.updateFailed'));
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };
  useEffect(() => {
    const fetchTotalCandidateByMonth = async () => {
      try {
        const baseUrl =
          `http://localhost:8080/auth/admin/getTotalApprovedEmployerByMonth?year=${year}`;
        const response = await fetch(baseUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your actual authorization token
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTotalEmployerByMonth(data.approvedEmployerMap);
        } else {
          console.error("Failed to fetch");
        }
      } catch (error: any) {
        setHttpError(error.message);
      }
    };
    fetchTotalCandidateByMonth();
  }, [year]);

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



  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <SpinnerLoading />
    );
  }

  if (httpError) {
    return (
      <Page404 error={httpError} />
    )
  }
  return (
    <>
      {edit && editingEmployer && (
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
                          src={editingEmployer.companyLogo || "https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg"}
                          alt="Candidate"
                          className="img-fluid rounded-circle"
                          style={{ width: "10em", objectFit: "fill", height: '150px' }}
                        />
                      </div>

                    </label>
                  </div>

                  <form>
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">
                            {t('placeholders.email')}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            placeholder={t('placeholders.email')}
                            readOnly
                            value={editingEmployer.email || ""}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            {t('placeholders.fullName')}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder={t('placeholders.fullName')}
                            readOnly
                            value={editingEmployer.userName}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            {t('placeholders.taxNumber')}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Tax Number"
                            id="name"
                            readOnly
                            value={editingEmployer.taxNumber || ""}
                          />

                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            {t('placeholders.companyName')}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder={t('placeholders.companyName')}
                            readOnly
                            value={editingEmployer.companyName || ""}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            {t('placeholders.phoneNumber')}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder={t('placeholders.phoneNumber')}
                            value={editingEmployer.phoneNumber}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-6">

                        <div className="mb-3">
                          <label htmlFor="address" className="form-label">
                            {t('placeholders.address')}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="address"
                            placeholder={t('placeholders.address')}
                            value={editingEmployer.address || 'User address is null'}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>


                    {/* Các trường thông tin khác ở đây */}
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="bio" className="form-label">
                            {t('placeholders.bio')}
                          </label>
                          <textarea
                            className="form-control"
                            id="bio"
                            rows={4}
                            value={editingEmployer.bio || 'User bio is null'}
                            readOnly

                          ></textarea>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label"> {t('status.status')}</label>
                          <div className="row ms-3  align-items-center d-flex justify-content-center">
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="enable"
                                value="ENABLE"
                                checked={editingEmployer.status === "ENABLE"}
                                onChange={handleStatusChange}
                              />
                              <label className="form-check-label" htmlFor="enable">
                                {t('status.enable')}
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="disable"
                                value="DISABLE"
                                checked={editingEmployer.status === "DISABLE"}
                                onChange={handleStatusChange}
                              />
                              <label className="form-check-label" htmlFor="disable">
                                {t('status.disable')}
                              </label>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <button type="button" className="btn btn-success" onClick={updateEmployerStatus}>
                        {t('btn.btnUpdate')}
                      </button>
                      <button type="submit" className="btn btn-danger ms-3" onClick={handleCancel}>
                        {t('btn.btnCancel')}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*  */}
      {!edit && !editingEmployer && (
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-9">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="mb-0 fw-bold text-success">{t('dashboard.statisticsApprovedEmployer')}</h6>
                <div className="col-3">
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
              </div>
              <div className="card">
                <BarChart
                  xAxis={[
                    {
                      id: "barCategories",
                      data: xLabels,
                      scaleType: "band",
                    },
                  ]}
                  series={[
                    {
                      data: employerData.map((item) => item.value),
                      label: t('dashboard.approvedEmployer'),
                      color: "#198754"
                    },
                  ]}
                  height={450}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-12">
            <div className="bg-light rounded h-100 p-4">
              {/* Search form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                searchHandleChange(search, startDate, endDate, searchStatus);
              }}>
                <div className="form-row">
                  <div className="row">
                    <div className="col-md-4 col-lg-3 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="keyword"
                        placeholder="Email"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 col-lg-2 mb-3">

                      <input
                        type="date"
                        className="form-control"
                        id="keyword"
                        placeholder="Keyword"

                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 col-lg-2 mb-3">
                      <input
                        type="date"
                        className="form-control"
                        id="keyword"
                        placeholder="Keyword"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 col-lg-2 mb-3">
                      <select
                        className="form-select"
                        id="status"
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                      >
                        <option value="ENABLE">{t('status.enable')}</option>
                        <option value="DISABLE">{t('status.disable')}</option>
                      </select>
                    </div>

                    <div className="col-md-2 col-lg-2 mb-3 text-center">
                      <button
                        className="btn btn-success btn-block"
                        type="button"
                        onClick={() =>
                          searchHandleChange(search, startDate, endDate, searchStatus)
                        }
                      >
                        {t('searchForm.searchBtn')}
                      </button>
                    </div>

                    {employers.length > 0 && (
                      <div className="col-md-2 col-lg-1 mb-3">
                        <CSVLink
                          className="btn btn-success btn-block"
                          data={employers}
                          filename="Approved Job"
                          target="_blank"
                        >
                          Excel
                        </CSVLink>
                      </div>
                    )}
                  </div>
                </div>
              </form>
              <>
                {employers.length > 0 ? (
                  <div className="table-responsive ">
                    <table className="table">
                      <thead className="text-center">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">{t('table.name')}</th>
                          <th scope="col">{t('table.email')}</th>
                          <th scope="col">{t('table.companyName')}</th>
                          <th scope="col">{t('table.companyLogo')}</th>
                          <th scope="col">{t('table.taxNumber')}</th>
                          <th scope="col">{t('table.phone')}</th>
                          <th scope="col">{t('table.status')}</th>
                          <th scope="col">{t('table.action')}</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {employers.map((employer, index) => (
                          <tr key={employer.userId} style={{ verticalAlign: 'middle' }}>
                            <th scope="row">{index + 1}</th>
                            <td>{employer.userName}</td>
                            <td>{employer.email}</td>
                            <td>{employer.companyName}</td>
                            <td>
                              {employer.companyLogo && (
                                <img
                                  src={employer.companyLogo}
                                  alt={`Profile image of ${employer.userName}`}
                                  className="text-start" style={{ maxWidth: '80px', maxHeight: '100px' }}
                                />
                              )}
                            </td>
                            <td>{employer.taxNumber}</td>
                            <td>{employer.phoneNumber}</td>
                            <td>{employer.status}</td>
                            <td style={{ minWidth: '100px' }}>
                              <button type="button" className="btn btn-success" onClick={() => handleEditEmployer(employer)}>
                                <i className="fa fa-pencil-alt"></i>  {t('btn.btnEdit')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {totalPage >= 2 && (
                      <div className="mt-3">
                        <Pagination
                          currentPage={currentPage}
                          totalPage={totalPage}
                          paginate={paginate}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="background">
                      {t('admin.noUser')}
                    </div>
                    <div>
                      <img
                        src="/assets/img/sorry.png"
                        className="img-fluid w-50"
                      />
                    </div>
                  </div>
                )}
              </>

            </div>
          </div>
        </div>
      </div>

      {showToast === true && (

        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
          <div
            className={`toast ${showToast ? "show" : ""}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header bg-success text-white">
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


      <style>
        {
          `
          .form-check-input:checked{
            background-color: #198754;
          }
          `
        }

      </style>
    </>
  );
};
