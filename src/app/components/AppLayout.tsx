import { Outlet } from 'react-router-dom';
import { TrackPageView } from './TrackPageView';

export function AppLayout() {
  return (
    <>
      <TrackPageView />
      <Outlet />
    </>
  );
}
