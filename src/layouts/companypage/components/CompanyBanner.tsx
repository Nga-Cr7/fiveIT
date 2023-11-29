import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
export function CompanyBanner({}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="container-xxl py-5 bg-dark page-header mb-5">
        <div className="container my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
          {t('company.companyBanner.pageTitle')}
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb text-uppercase">
              <li className="breadcrumb-item">
                <Link to="/home">{t('company.companyBanner.home')}</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/company" className="text-white active">{t('company.companyBanner.company')}</Link>
              </li>
              
            </ol>
          </nav>
        </div>
      </div>
      <style>
        {`
      .page-header {
        background: linear-gradient(rgba(43, 57, 64, .5), rgba(43, 57, 64, .5)), url(https://jobs.washingtonpost.com/getasset/5c48ff8d-4e30-4ed7-a447-a4de335ecf45/) center center no-repeat;
      }
      
      `}
      </style>
    </>
  );
}
