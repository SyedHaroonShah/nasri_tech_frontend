import { BrowserRouter } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <PublicRoutes />
      <AdminRoutes />
    </BrowserRouter>
  );
};

export default AppRoutes;
