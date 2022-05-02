import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRouter from "./components/ProtectedRouter";
import UserManagement from "./pages/Home/AppContent/UserManagement";
import AttractionManagement from "./pages/Home/AppContent/AttractionManagement";
import FoodManagement from "./pages/Home/AppContent/FoodManagement";
import "./SnowApp.less";

function SnowApp() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRouter>
            <Home />
          </ProtectedRouter>
        }
      >
        <Route
          path="user"
          element={<UserManagement />}
        />
        <Route
          path="attraction"
          element={<AttractionManagement />}
        />
        <Route
          path="food"
          element={<FoodManagement />}
        />
        <Route
          index
          element={ <UserManagement /> }
        />
      </Route>
      <Route
        path="/login"
        element={<Login/>}
      />
    </Routes>
  );
}

export default SnowApp;
