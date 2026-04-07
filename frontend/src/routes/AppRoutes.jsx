import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ApiKeyGenerator from "../pages/Apikeygenerator";
import PasswordGenerator from "../pages/PasswordGenerator";
import UUIDGenerator from "../pages/Uuidgenerator";
import RandomNumberGenerator from "../pages/RandomNumberGenerator";
import FakeUserGenerator from "../pages/Fakeusergenerator";

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
        <Route
          path="/tools/random-number"
          element={<RandomNumberGenerator />}
        />
        <Route
          path="/tools/fake-user-generator"
          element={<FakeUserGenerator />}
        />

        {/* 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
};

export default AppRoutes;
