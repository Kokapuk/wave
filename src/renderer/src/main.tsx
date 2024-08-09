import { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import './styles/default.scss';
import Toasts from './components/Toasts';

const Home = lazy(() => import('./pages/Home'));
const AddYouTube = lazy(() => import('./pages/AddYouTube'));
const AddSoundCloud = lazy(() => import('./pages/AddSoundCloud'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'youtube',
        element: <AddYouTube />,
      },
      {
        path: 'soundcloud',
        element: <AddSoundCloud />,
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
