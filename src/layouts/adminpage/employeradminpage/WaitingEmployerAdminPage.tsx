import React, { ChangeEvent, useEffect, useState } from "react";
import { UserManagementModel } from "../../../models/UserManagementModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Page404 } from "../../errors/Page404";
import { Pagination } from "../../utils/Pagination";
import { useTranslation } from 'react-i18next';


export const WaitingEmployerAdminPage = () => {
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
  const waiting: string = "WAITING";
  const approval: string = "APPROVED";
  const enableStatus: string = "ENABLE";
  const [editingEmployer, setEditingEmployer] = useState<UserManagementModel | null>(null);
  const [edit, setEdit] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");


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
        baseUrlForJob = `http://localhost:8080/auth/admin/getAllEmployers?email=${search}&startDate=${startDate}&endDate=${endDate}&status=${searchStatus}&page=${currentPage - 1}&size=${employersPerPage}&approval=${waiting}`;
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
            employerData.specializationNames
          );

          loadedEmployers.push(candidate);
        });

        setEmployers(loadedEmployers);

        setTotalEmployers(data.totalElements);
        setTotalPage(data.totalPages);
        setIsLoading(false);
        if (updated) {
          setCurrentPage(1);
          setUpdated(false);
        }
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
    let newURL = `http://localhost:8080/auth/admin/getAllEmployers?email=${search}&startDate=${startDate}&endDate=${endDate}&status=${searchStatus}&page=<currentPage>&size=${employersPerPage}&approval=${waiting}`;
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


  const handleCancel = () => {
    setEditingEmployer(null);
    setEdit(false);
  };

  const updateEmployerApproval = async () => {
    if (editingEmployer) {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:8080/auth/admin/updateEmployerApproval`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: editingEmployer.userId,
            status: 'ENABLE',
            approval: 'APPROVED',
          }),
        });

        if (response.ok) {
          setIsLoading(false);
          setUpdated(true);
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
                    <button type="button" className="btn btn-primary" onClick={updateEmployerApproval}>
                      {t('btn.btnApproved')}
                    </button>
                    <button type="submit" className="btn btn-danger ms-3" onClick={handleCancel}>
                      {t('btn.btnCancel')}
                    </button>
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
              {/* Search form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                searchHandleChange(search, startDate, endDate, searchStatus);
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

                      <input
                        type="date"
                        className="form-control"
                        id="keyword"
                        placeholder="Keyword"

                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 mb-3">
                      <input
                        type="date"
                        className="form-control"
                        id="keyword"
                        placeholder="Keyword"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 mb-3">
                      <button
                        className="btn btn-primary btn-block"
                        type="button"
                        onClick={() =>
                          searchHandleChange(search, startDate, endDate, searchStatus)
                        }
                      >
                        {t('searchForm.searchBtn')}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <>
                {employers.length > 0 ? (
                  <div className="table-responsive">
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
                          <th scope="col">{t('table.approval')}</th>
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
                            <td>{employer.approval}</td>
                            <td>
                              <button type="button" className="btn btn-primary" onClick={() => handleEditEmployer(employer)}>
                                <i className="fa fa-pencil-alt"></i>  {t('btn.btnEdit')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // <p className="text-center text-warning">We don't find any user with the conditions you require.</p>
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
