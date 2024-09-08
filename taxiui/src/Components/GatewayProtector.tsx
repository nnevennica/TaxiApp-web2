import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchDriveState } from "../Metadata/ApiServices";
import { jwtDecode } from "jwt-decode";

interface GatewayProtectorProps {
  allowedRoles: string[];
}

interface DecodedToken {
  role: string;
  id: number;
}

const GatewayProtector: React.FC<GatewayProtectorProps> = ({
  allowedRoles,
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken: DecodedToken = jwtDecode(token);
          const { role, id } = decodedToken;

          const state = await fetchDriveState(id, role === "Driver");
            console.log(state)
          if (state && window.location.pathname !== "/drive") {
            window.location.href = "/drive";
            return;
          }
          setIsAuthorized(allowedRoles.includes(role));
        } catch (error) {
          console.error("Authorization error:", error);
          setIsAuthorized(false);
        }
      }

      setIsLoading(false);
    };

    checkAuthorization();
  }, [allowedRoles, location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GatewayProtector;
