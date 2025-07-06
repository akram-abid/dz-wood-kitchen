import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import KitchenGallery from "./pages/projects";
import KitchenDetails from "./pages/Kitchen";
import KitchenOrderPage from "./pages/kitchenOrderPage";
import ProfilePage from "./pages/profile";
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import AdminDashboard from "./pages/adminDashboard";
import OrderDetails from "./pages/orderDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmailPage from "./pages/verifyEmail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/gallery",
    element: <KitchenGallery />,
  },
  {
    path: "/gallery/:kitchenId",
    element: <KitchenDetails />,
  },
  {
    path: "/order",
    element: <KitchenOrderPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/orders/:id",
    element: <OrderDetails />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);