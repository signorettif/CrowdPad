import { Outlet, NavLink } from 'react-router';

import { cn } from '../utils/cn';

export const AppPageLayout = () => {
  return (
    <>
      <AppPageNav />
      <Outlet />
    </>
  );
};

function AppPageNav() {
  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    cn(
      'px-3 py-2 rounded-md text-sm font-medium',
      isActive
        ? 'bg-gray-900 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    );

  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto flex h-16 items-center p-6">
        <NavLink to="/" className="text-xl font-bold text-white">
          CrowdPad
        </NavLink>
        <div className="ml-10 space-x-2">
          <NavLink to="/" className={linkStyles}>
            Home
          </NavLink>
          <NavLink to="/admin" className={linkStyles}>
            Admin
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
