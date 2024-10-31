import { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Toasts from './components/Toasts';
import './styles/default.scss';

const Home = lazy(() => import('./pages/Home'));
const AddTrack = lazy(() => import('./pages/AddTrack'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'add',
        element: <AddTrack />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <>
    <RouterProvider router={router} />
    <Toasts />
  </>
);
