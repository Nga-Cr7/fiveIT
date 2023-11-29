import React, { useState, useEffect, ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps)=> {
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasError) {
      // Redirect to the error page
      navigate('/page404');
    }
  }, [hasError, navigate]);

  const componentDidCatch = (error: Error, errorInfo: React.ErrorInfo) => {
    // You can log the error or perform other actions here
    console.error(error, errorInfo);
    setHasError(true);
  };

  if (hasError) {
    // You can render a custom error message here if needed
    return <div>Something went wrong. Please try again later.</div>;
  }

  return <>{children}</>;
}


