import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const BackToTopButton = () => {
    const [showButton, setShowButton] = useState(false);
  
    // Function to handle the button click
    const handleButtonClick = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };
  
    // Function to handle scrolling and show/hide the button
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    return (
      <Link to="#" className={`btn btn-lg btn-primary btn-lg-square back-to-top ${showButton ? 'd-block' : 'd-none'}`} onClick={handleButtonClick}>
        <i className="bi bi-arrow-up"></i>
      </Link>
    );
  };
  

  
  
  
  
  