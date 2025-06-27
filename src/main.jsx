import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import KitchenGallery from "./pages/projects";
import KitchenDetails from "./pages/Kitchen";
import KitchenOrderPage from "./pages/kitchenOrderPage";

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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);