import { Outlet } from 'react-router-dom';
import { AppShell } from '../AppShell';

export const AppShellLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};
