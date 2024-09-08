import { Routes, Route } from "react-router-dom";
import { loginService, registerService, fetchUserData, updateUser, addDrive, fetchDrives, rateDriver, fetchNewDrives, acceptDrive, fetchDrivers, verifyDriver, blockDriver, fetchDriveState } from "./Metadata/ApiServices";
import Account from "./Components/Account";
import Drive from "./Components/Drive";
import Drives from "./Components/Drives";
import GatewayProtector from "./Components/GatewayProtector";
import LoginForm from "./Components/LogReg/Login";
import RegisterForm from "./Components/LogReg/Register";
import CreateDrive from "./Components/NewDrive";
import NewDrives from "./Components/NewDrives";
import Verification from "./Components/Verification";
import RateDriverForm from "./Components/Drive{id}";

const RoutesConfig = () => (
  <Routes>
    <Route path="/" element={<LoginForm loginService={loginService} registerService={registerService} />} />
    <Route path="/register" element={<RegisterForm registerService={registerService} />} />

    {/* Protected routes for User, Driver, Admin */}
    <Route element={<GatewayProtector allowedRoles={['User', 'Driver', 'Admin']} />}>
      <Route path="/account" element={<Account fetchUserData={fetchUserData} updateUser={updateUser} />} />
    </Route>

    {/* Protected routes for User */}
    <Route element={<GatewayProtector allowedRoles={['User']} />}>
      <Route path="/new-drive" element={<CreateDrive addDrive={addDrive} />} />
      <Route path="/previous-drives" element={<Drives fetchDrives={fetchDrives} />} />
      <Route path="/drive/:id" element={<RateDriverForm rateDriver={rateDriver} />} />
    </Route>

    {/* Protected routes for Driver */}
    <Route element={<GatewayProtector allowedRoles={['Driver']} />}>
      <Route path="/new-rides" element={<NewDrives fetchNewDrives={fetchNewDrives} acceptDrive={acceptDrive} />} />
      <Route path="/my-rides" element={<Drives fetchDrives={fetchDrives} />} />
    </Route>

    {/* Protected routes for Admin */}
    <Route element={<GatewayProtector allowedRoles={['Admin']} />}>
      <Route path="/all-rides" element={<Drives fetchDrives={fetchDrives} />} />
      <Route path="/verification" element={<Verification fetchDrivers={fetchDrivers} verifyDriver={verifyDriver} blockDriver={blockDriver} />} />
    </Route>

    {/* Protected routes for User, Driver */}
    <Route element={<GatewayProtector allowedRoles={['User', 'Driver']} />}>
      <Route path="/drive" element={<Drive fetchDriveState={fetchDriveState} />} />
    </Route>
  </Routes>
);

export default RoutesConfig;
