import React, { ChangeEvent, useEffect, useState } from "react";
import { UserManagementModel } from "../../../models/UserManagementModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Page404 } from "../../errors/Page404";
import { Pagination } from "../../utils/Pagination";
import { useTranslation } from 'react-i18next';


export const CandidateAdminPage = () => {

  const { t } = useTranslation();

  // Handle loading + Errors
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  // Handle search according to the search input

  // Handle data for jobs and jobs category
  const [candidates, setCandidates] = useState<UserManagementModel[]>([]);

  // Handle pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(5);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [searchUrl, setSearchUrl] = useState("");
  const [search, setSearch] = useState("");

  const [editingCandidate, setEditingCandidate] =
    useState<UserManagementModel | null>(null);

  const [edit, setEdit] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("ENABLE");
  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);

    // Automatically hide the toast after 3 seconds (3000 milliseconds)
    setTimeout(() => setShowToast(false), 3000);
  };

  const token: any = localStorage.getItem("jwt_token");
  const fetchAllCandidates = async () => {
    try {
      let baseUrlForJob = "";
      if (searchUrl === "") {
        baseUrlForJob = `http://localhost:8080/auth/admin/getAllCandidates?email=${search}&startDate=${startDate}&endDate=${endDate}&status=${searchStatus}&page=${currentPage - 1
          }&size=${candidatesPerPage}`;
      } else {
        let searchWithPage = searchUrl.replace(
          "<currentPage>",
          `${currentPage - 1}`
        );
        baseUrlForJob = searchWithPage;
      }
      const response = await fetch(baseUrlForJob, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Replace with your actual authorization token
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const loadedCandidates: UserManagementModel[] = [];
        data.content.forEach((candidateData: any) => {
          const candidate = new UserManagementModel(
            candidateData.profileType,
            candidateData.userId,
            candidateData.name,
            candidateData.email,
            candidateData.status,
            candidateData.approval,
            candidateData.userImage,
            candidateData.gender || null,
            candidateData.phoneNumber,
            candidateData.address || null,
            candidateData.bio || null,
            null,
            null,
            null,
            candidateData.specializationNames
          );

          loadedCandidates.push(candidate);
        });

        setCandidates(loadedCandidates);
        if (updated) {
          setCurrentPage(1);
          setUpdated(false);
        }

        setTotalCandidates(data.totalElements);
        setTotalPage(data.totalPages);
        setIsLoading(false);
      } else {
        throw new Error("Request failed");
      }
    } catch (error: any) {
      setHttpError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCandidates();
  }, [currentPage, searchUrl, updated]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <Page404 error={httpError} />;
  }

  const searchHandleChange = (
    searchKey: string,
    searchStartDate: string,
    searchEndDate: string,
    searchStatus: string
  ) => {
    setCurrentPage(1);
    setEdit(false);
    let newURL = ` http://localhost:8080/auth/admin/getAllCandidates?email=${search}&startDate=${startDate}&endDate=${endDate}&status=${searchStatus}&page=<currentPage>&size=${candidatesPerPage}`;
    setSearchUrl(newURL);
  };

  const handleEditCandidate = (candidate: UserManagementModel) => {
    setEditingCandidate(candidate);
    setEdit(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smooth scrolling
    });
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.value;

    if (editingCandidate) {
      setEditingCandidate({
        ...editingCandidate,
        status: newStatus,
      });
    }
  };

  const handleCancle = () => {
    setEditingCandidate(null);
    setEdit(false);
  };

  const updateCandidateStatus = async () => {
    if (editingCandidate) {
      try {
        const response = await fetch(
          `http://localhost:8080/auth/admin/updateCandidateStatus`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: editingCandidate.userId,
              status: editingCandidate.status,
              approval: editingCandidate.approval,
            }),
          }
        );

        if (response.ok) {
          setUpdated(true);
          setIsLoading(false);
          showToastMessage(t('showToastMessage.updateSuccess'));
          handleCancle();
        } else {
          showToastMessage(t('showToastMessage.updateFailed'));
        }
      } catch (error) {
        console.error("Error updating status:", error);
        // Handle the error as needed (e.g., show an error message to the user).
      }
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <Page404 error={httpError} />;
  }
  return (
    <>
      {edit && editingCandidate && (
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
                          src={
                            editingCandidate.userImg ||
                            "https://res.cloudinary.com/dzqoi9laq/image/upload/v1699419757/logoo_pyz2sp.png"
                          }
                          alt="Candidate"
                          className="img-fluid rounded-circle"
                          style={{
                            width: "10em",
                            objectFit: "fill",
                            height: "150px",
                          }}
                        />


                      </div>

                    </label>
                  </div>
                  <form>
                    <div className="row">
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
                            value={editingCandidate.userName}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            {t('placeholders.gender.gender')}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder={t('placeholders.gender.gender')}
                            readOnly
                            value={
                              editingCandidate.gender ||
                              "User gender is not yet chosen"
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            {t('placeholders.address')}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder={t('placeholders.address')}
                            value={
                              editingCandidate.address || "User address is null"
                            }
                            readOnly
                          />
                        </div>
                      </div>
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
                            value={editingCandidate.phoneNumber}
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
                            value={editingCandidate.bio || "User bio is null"}
                            readOnly
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">{t('status.status')}</label>
                          <div className="row ms-3  align-items-center d-flex justify-content-center">
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="enable"
                                value="ENABLE"
                                checked={editingCandidate.status === "ENABLE"}
                                onChange={handleStatusChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="enable"
                              >
                                {t('status.enable')}
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="disable"
                                value="DISABLE"
                                checked={editingCandidate.status === "DISABLE"}
                                onChange={handleStatusChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="disable"
                              >
                                {t('status.disable')}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={updateCandidateStatus}
                      >
                        {t('btn.btnUpdate')}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-danger ms-3"
                        onClick={handleCancle}
                      >
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

      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-12">
            <div className="bg-light rounded h-100 p-4">
              {/* tìm kiếm ở đây */}
              <form onSubmit={(e) => {
                e.preventDefault();
                searchHandleChange(
                  search,
                  startDate,
                  endDate,
                  searchStatus
                )
              }}>
                <div className="form-row">
                  <div className="row">
                    <div className="col-md-4 col-lg-4 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="keyword"
                        placeholder="Email"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2  mb-3">
                      {/* <span>From</span> */}
                      <input
                        type="date"
                        className="form-control"
                        id="keyword"
                        placeholder={t('searchForm.keyword')}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 mb-3">
                      {/* <span>To</span> */}
                      <input
                        type="date"
                        className="form-control"
                        id="keyword"
                        placeholder="Keyword"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 mb-3">
                      <select
                        className="form-select"
                        id="status"
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                      >
                        {/* <option value="" >Status</option> */}
                        <option value="ENABLE"> {t('status.enable')}</option>
                        <option value="DISABLE">{t('status.disable')}</option>
                      </select>
                    </div>

                    <div className="col-md-2 mb-3">
                      <button
                        className="btn btn-primary btn-block"
                        type="button"
                        onClick={() =>
                          searchHandleChange(
                            search,
                            startDate,
                            endDate,
                            searchStatus
                          )
                        }
                      >
                        {t('searchForm.searchBtn')}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {candidates.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead className="text-center">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">{t('table.name')}</th>
                        <th scope="col">{t('table.email')}</th>
                        <th scope="col">{t('table.img')}</th>
                        <th scope="col">{t('table.gender')}</th>
                        <th scope="col">{t('table.phone')}</th>
                        <th scope="col">{t('table.status')}</th>
                        <th scope="col">{t('table.action')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {candidates.map((candidate, index) => (
                        <tr
                          key={candidate.userId}
                          style={{ verticalAlign: "middle" }}
                        >
                          <th scope="row">{index + 1}</th>
                          <td>{candidate.userName}</td>
                          <td>{candidate.email}</td>
                          <td>
                            {candidate.userImg && (
                              <img
                                src={candidate.userImg}
                                alt={`Profile image of ${candidate.userName}`}
                                className="text-start"
                                style={{ maxWidth: "80px", maxHeight: "100px" }}
                              />
                            )}
                          </td>
                          <td>{candidate.gender}</td>
                          <td>{candidate.phoneNumber}</td>
                          <td>{candidate.status}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleEditCandidate(candidate)}
                            >
                              <i className="fa fa-pencil-alt"></i> {t('btn.btnEdit')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
            </div>
          </div>
        </div>
      </div>
      {totalPage >= 2 && (
        <div className="mt-3">
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            paginate={paginate}
          />
        </div>
      )}

      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
        <div
          className={`toast ${showToast ? "show" : ""}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
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
    </>
  );
};
