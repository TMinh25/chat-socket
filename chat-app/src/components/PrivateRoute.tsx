import { Text, Toast } from "@chakra-ui/react";
import { FC, ReactElement, ReactNode, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppState } from "../hooks/useAppState";
import { useAuth } from "../hooks/useAuth";
import { Component } from "react";
import IUser from "../models/user.model";

const PrivateRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { authenticated, currentUser } = useAuth();
  const { toast } = useAppState();

  return authenticated ? (
    <>{children}</>
  ) : (
    <>
      {(function () {
        toast({ title: "Vui lòng đăng nhập", status: "warning" });
      })()}
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    </>
  );
};
export default PrivateRoute;
