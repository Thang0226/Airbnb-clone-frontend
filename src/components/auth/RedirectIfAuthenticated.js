import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RedirectIfAuthenticated = () => {
  const { token } = useSelector((state) => state.account);

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default RedirectIfAuthenticated;
