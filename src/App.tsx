// import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./core/Index.tsx";
import Login from "./core/Login.tsx";
import StudentForm from "./pages/student-form/index.tsx";
import DashBoard from "./pages/dashboard/index.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastProvider } from "./hook/useToast.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/",
      element: <Index />,
      children: [
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
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </>
  );
}

export default App;
