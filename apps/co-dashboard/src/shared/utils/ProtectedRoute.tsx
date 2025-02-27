import React from 'react';
import { Router } from 'next/router';
import { useAuthenticationSpec } from '../context/AuthenticationContext';

// check if you are on the client (browser) or server
const isBrowser = () => typeof window !== 'undefined';

type ProtectedRouteProps = {
  router: Router;
  children: React.ReactElement;
};

export const unprotectedRoutes = [
  '/login',
  '/reset-password',
  '/forgot-password',
  '/expired-link',
  '/404',
];

const ProtectedRoute = ({ router, children }: ProtectedRouteProps) => {
  // Identify authenticated user
  const { isLoggedIn } = useAuthenticationSpec();

  /**
   * @var pathIsProtected Checks if path exists in the unprotectedRoutes routes array
   */
  const pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;

  if (isBrowser() && !isLoggedIn && pathIsProtected) {
    return children;
  }

  return children;
};

export default ProtectedRoute;
