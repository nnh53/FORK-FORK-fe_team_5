import React from 'react'
import type { Role } from '../../interfaces/roles.interface';
import { Navigate, Outlet } from 'react-router-dom';


export function userRoleRoute(roleName: Role):string {
  switch (roleName) {
    case 'ROLE_ADMIN':
      return '/admins';
    case 'ROLE_STAFF':
      return '/staffs';
    case 'ROLE_MEMBER':
      return '/members';
    default:
      return '/';
  }
}

interface RoleRouteProps {
  allowedRoles: Role[];
  redirectPath: string;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, redirectPath = '/login' }) => {
  const isLoggedIn = true;//tam thoi

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  console.log("Allowed Roles: ", allowedRoles);

  const userRoles = ['ROLE_ADMIN']; // Example roles, replace with actual user roles
  const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));

  if (!hasAllowedRole) {//tam thoi
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;

};

export default RoleRoute;