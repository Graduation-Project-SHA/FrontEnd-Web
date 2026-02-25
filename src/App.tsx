import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom"
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Layout from "./components/Layout/Layout";
import Roles from "./pages/roles/Roles";
import CreateRole from "./pages/roles/CreateRole";
import SystemUsers from "./pages/admin/SystemUsers";
import AddSystemUser from "./pages/admin/AddSystemUser";
import Patients from "./pages/patients/Patients";
import PatientDetails from "./pages/patients/PatientDetails";
import Doctors from "./pages/doctors/Doctors";
import Pharmacy from "./pages/pharmacy/Pharmacy";
import Hospitals from "./pages/hospitals/Hospitals";
import DoctorDetails from "./pages/doctors/DoctorDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/roles",
        element: <Roles />,
      },
      {
        path: "/roles/create",
        element: <CreateRole />,
      },
      {
        path: "/admins",
        element: <SystemUsers />,
      },
      {
        path: "/admins/create",
        element: <AddSystemUser />,
      },
      {
        path: "/patients",
        element: <Patients />,
      },
      {
        path: "/doctors",
        element: <Doctors />,
      },
      {
        path: "/doctors/:id",
        element: <DoctorDetails />,
      },
      {
        path: "/patients/:id",
        element: <PatientDetails />,
      },
      {
        path: "/pharmacies",
        element: <Pharmacy />,
      },
      {
        path: "/hospitals",
        element: <Hospitals />,
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgetPassword",
    element: <ForgetPassword />,
  }
]);



function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
