import { lazy, useState, useEffect, startTransition } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from './layouts/utils/AuthProvide';
import { BackToTopButton } from './layouts/utils/BackToTopButton';


const UserApp = lazy(() => import('./UserApp'));
const AdminApp = lazy(() => import('./AdminApp'));
const EmployerApp = lazy(() => import('./EmployerApp'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    if (token) {
      startTransition(() => {
        setIsAuthenticated(true);
      });
    }
  }, [token]);


  let componentToRender;


  if (isAuthenticated) {
    if (user.user?.role === 'admin') {
      componentToRender = <AdminApp />;
    } else if (user.user?.role === 'employer') {
      componentToRender = <EmployerApp />;
    } else {
      componentToRender = <UserApp />;
    }
  } else {
    componentToRender = <UserApp />;
  }

  return (
    <>
      <Routes>
        <Route path="*" element={componentToRender} />
      </Routes>
      <BackToTopButton />
    </>
  );
}

export default App;