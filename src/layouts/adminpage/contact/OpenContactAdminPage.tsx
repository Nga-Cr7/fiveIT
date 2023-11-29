import React, { useEffect, useState } from "react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Page404 } from "../../errors/Page404";
import { Pagination } from "../../utils/Pagination";
import { ContactModel } from "../../../models/ContactModel";
import { useTranslation } from 'react-i18next';


export const OpenContactAdminPage = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [contacts, setContacts] = useState<ContactModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchUrl, setSearchUrl] = useState("");
  const [search, setSearch] = useState("");
  const [editingContact, setEditingContact] = useState<ContactModel | null>(null);
  const [edit, setEdit] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const showToastMessage = (message: string) => {
    setMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const token: any = localStorage.getItem("jwt_token");

  const fetchAllContacts = async () => {
    try {
      let baseUrlForJob = "";
      if (searchUrl === "") {
        baseUrlForJob = `http://localhost:8080/auth/admin/getAllContacts?email=${search}&status=OPEN&page=${currentPage - 1}&size=${contactsPerPage}`;
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

        const loadedContacts: ContactModel[] = [];

        data.content.forEach((contactData: any) => {
          const contact = new ContactModel(
            contactData.contactId,
            contactData.name,
            contactData.email,
            contactData.subject,
            contactData.message,
            contactData.createdAt,
            contactData.createdBy,
            contactData.updatedAt,
            contactData.updatedBy,
            contactData.status
          )
          loadedContacts.push(contact);
        })
        setContacts(loadedContacts);
        if (updated) {
          setCurrentPage(1);
          setUpdated(false);
        }
        setTotalContacts(data.totalElements);
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
    fetchAllContacts();
  }, [currentPage, searchUrl, updated]);

  const searchHandleChange = (searchKey: string) => {
    setCurrentPage(1);
    setEdit(false);
    let newURL = `http://localhost:8080/auth/admin/getAllContacts?email=${searchKey}&status=OPEN&page=<currentPage>&size=${contactsPerPage}`;
    setSearchUrl(newURL);
  };

  const handleEditContact = (contact: ContactModel) => {
    setEditingContact(contact);
    setEdit(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smooth scrolling
    });
  };


  const handleCancel = () => {
    setEditingContact(null);
    setEdit(false);
  };

  const updateContactStatus = async () => {

    if (editingContact) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/auth/admin/updateContactStatus`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contactId: editingContact.contactId,
            status: 'CLOSE',
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
      {edit && editingContact && (
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
                          src="https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg"
                          alt="Candidate"
                          className="img-fluid rounded-circle"
                          style={{ width: "10em" }}
                        />
                      </div>

                    </label>
                  </div>

                  <form>
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            {t('placeholders.name')}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder={t('placeholders.name')}
                            readOnly
                            value={editingContact.contactName}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            {t('placeholders.email')}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            placeholder={t('placeholders.email')}
                            readOnly
                            value={editingContact.contactEmail}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          {t('placeholders.subject')}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Subject"
                          id="subject"
                          readOnly
                          value={editingContact.contactSubject}
                        />

                      </div>

                      <div className="mb-3">
                        <label htmlFor="bio" className="form-label">
                          {t('placeholders.message')}
                        </label>
                        <textarea
                          className="form-control"
                          id="bio"
                          rows={4}
                          value={editingContact.contactMsg}
                          readOnly

                        ></textarea>
                      </div>
                      <div />
                    </div>
                    <div className="text-center">
                      <button type="button" className="btn btn-primary" onClick={updateContactStatus}>
                        {t('btn.btnClose')}
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

      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-12">
            <div className="bg-light rounded h-100 p-4">
              {/* Search form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  searchHandleChange(search);
                }}
              >
                <div className="form-row d-flex align-items-center justify-content-center">
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="keyword"
                      placeholder={t('searchForm.keyword')}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>&nbsp;</label>
                    <button
                      className="btn btn-primary btn-block"
                      type="button"
                      onClick={() => searchHandleChange(search)}
                    >
                      {t('searchForm.searchBtn')}
                    </button>
                  </div>
                </div>
              </form>
              <>
                {contacts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="text-center">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">{t('table.name')}</th>
                          <th scope="col">{t('table.email')}</th>
                          <th scope="col">{t('table.createdBy')}</th>
                          <th scope="col">{t('table.createdAt')}</th>
                          <th scope="col">{t('table.updatedAt')}</th>
                          <th scope="col">{t('table.updatedBy')}</th>
                          <th scope="col">{t('table.status')}</th>
                          <th scope="col">{t('table.action')}</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {contacts.map((contact, index) => (
                          <tr key={index} style={{ verticalAlign: 'middle' }}>
                            <th scope="row">{index + 1}</th>
                            <td>{contact.contactName}</td>
                            <td>{contact.contactEmail}</td>
                            <td>{contact.contactCreatedAt.toLocaleString()}</td>
                            <td>{contact.contactCreatedBy}</td>
                            <td>{contact.contactUpdatedAt?.toLocaleString() || ""}</td>
                            <td>{contact.contactUpdatedBy}</td>
                            <td>{contact.contactStatus}</td>
                            <td>
                              <button type="button" className="btn btn-primary" onClick={() => handleEditContact(contact)}>
                                <i className="fa fa-pencil-alt"></i> {t('btn.btnEdit')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // <p className="text-center text-warning">We don't find any contact with the conditions you require.</p>
                  <div className="text-center">
                    <div className="background">
                      {t('admin.noContact')}
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
            <strong className="me-auto"> {t('showToastMessage.status')}</strong>
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
