import { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import './styles/default.scss';
import Toasts from './components/Toasts';

const Home = lazy(() => import('./pages/Home'));
const AddYouTube = lazy(() => import('./pages/AddYouTube'));

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
        element: <h1>Coming soon...</h1>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <RouterProvider router={router} />
    <Toasts />
  </>
);
