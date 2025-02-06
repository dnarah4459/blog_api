import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import MyBlogs from "./pages/MyBlogs";
import AllBlogs from "./pages/AllBlogs";
import CreateBlog from "./pages/CreateBlog";
import ProtectedLayout from "./pages/ProtectedLayout";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <Login /> },
    ],
  },
  {
    path: "/protected",
    element: <ProtectedLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "myblogs",
        element: (
          <ProtectedRoute>
            <MyBlogs />
          </ProtectedRoute>
        ),
      },
      {
        path: "createblog",
        element: (
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        ),
      },
      {
        path: "allblogs",
        element: (
          <ProtectedRoute>
            <AllBlogs />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);

export default router;
