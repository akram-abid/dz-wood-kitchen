import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import KitchenGallery from "./pages/projects";
import KitchenDetails from "./pages/Kitchen";

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
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);