import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const userContext = createContext();

function UserProvider({ children }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin) {
      navigate("/user", { replace: true });
    }
  }, [isLogin]);
  return (
    <userContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </userContext.Provider>
  );
}

export default UserProvider;
