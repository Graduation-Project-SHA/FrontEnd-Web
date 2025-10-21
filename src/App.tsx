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
