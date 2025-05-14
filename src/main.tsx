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

const router = createBrowserRouter([
  {
    path: "/",
    element : <Index/>,
    children : [
      {
        path : '',
        element : <Login/>
      }
    ]
  },
  
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
