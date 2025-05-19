import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./core/Index.tsx";
import Login from "./core/Login.tsx";
import StudentForm from "./pages/student-form/index.tsx";
import DashBoard from "./pages/dashboard/index.tsx";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';


function App() {


  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
      children: [
        {
          path: "",
          element: <Login />,
        },
        {
          path: "/student-form",
          element: <StudentForm />,
        },
        {
          path: "/dashboard",
          element: <DashBoard />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer/>
    </>
  );
}

export default App;
