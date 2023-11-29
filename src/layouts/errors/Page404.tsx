import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"

export const Page404: React.FC<{ error: any}> = (props) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="container-xxl py-5 bg-dark page-header mb-5">
                <div className="container my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">404 Error</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb text-uppercase">
                            <li className="breadcrumb-item"><a href="#">Home</a></li>
                            <li className="breadcrumb-item"><a href="#">Pages</a></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">404 Error</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <i className="bi bi-exclamation-triangle display-1 text-primary"></i>
                            <h1 className="display-1">404</h1>
                            <h1 className="mb-4">Error: {props.error.message}</h1>
                            <p className="mb-4">We’re sorry, the page you have looked for does not exist on our website! Maybe go to our home page or try to use a search?</p>
                            <a className="btn btn-primary py-3 px-5" href="/home">Go Back</a>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
} 