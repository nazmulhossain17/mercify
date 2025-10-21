// hooks/useMemberStatus.ts
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/selectors/authSelectors';
import { useLocation } from 'react-router-dom';

export const useMemberStatus = () => {
  const user = useAppSelector(selectUser);
  const location = useLocation();
//   const navigate = useNavigate();

  const isFrozen = user?.status === 'freez';
  
  // Allowed routes for frozen/active members
  const allowedRoutes = ['/dashboard', '/dashboard/profile', '/dashboard/application-form'];
  
  const isRouteAllowed = (path: string) => {
    return allowedRoutes.some(route => path.startsWith(route));
  };

  const shouldRestrictAccess = (isFrozen) && !isRouteAllowed(location.pathname);

  return {
    isFrozen,
    shouldRestrictAccess,
    allowedRoutes
  };
};