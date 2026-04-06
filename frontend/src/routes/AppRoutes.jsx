import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ApiKeyGenerator from "../pages/Apikeygenerator";
import PasswordGenerator from "../pages/PasswordGenerator";
import UUIDGenerator from "../pages/Uuidgenerator";
import Navbar from "../components/Navbar";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<Home />} />
        <Route path="/tools/api-key-generator" element={<ApiKeyGenerator />} />
        <Route
          path="/tools/password-generator"
          element={<PasswordGenerator />}
        />
        <Route path="/tools/uuid-generator" element={<UUIDGenerator />} />

        {/* 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
};

export default AppRoutes;
