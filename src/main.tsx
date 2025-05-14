import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,

} from "react-router-dom";
import Index  from "./core/Index.tsx";
import Login from './core/Login.tsx';
import StudentForm from './pages/student-form/index.tsx';
import DashBoard from './pages/dashboard/index.tsx'

import './i18n';

const router = createBrowserRouter([
  {
    path: "/",
    element : <Index/>,
    children : [
      {
        path : '',
        element : <Login/>
      },
      {
        path : '/student-form',
        element : <StudentForm/>
      },
      {
        path : '/dashboard',
        element : <DashBoard/>
      }
    ]
  },
  
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
