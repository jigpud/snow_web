import { useContext } from "react";
import { userContext } from "../UserProvider";
import { Navigate } from "react-router-dom";

function ProtectedRouter({ children }) {
  const { isLogin } = useContext(userContext);
  if (isLogin) {
    return children;
  }
  return (
    <Navigate to="/login" replace/>
  );
}

export default ProtectedRouter;
