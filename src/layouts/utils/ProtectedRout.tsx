import { Navigate, Route } from "react-router-dom";
import { useAuth } from "./AuthProvide";
import { Page404 } from "../errors/Page404";

export const ProtectedRoute = ({ path, element }: { path: string; element: React.ReactNode }) => {
  const { user } = useAuth(); // Replace with your auth context logic

  return user ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/page404" replace state={{ error: "You are not allowed to access" }} />
  );
};
