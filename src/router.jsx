// src/router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import UrlInputPage from "./index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UrlInputPage />,
  },
  {
    path: "/map",
    element: <App />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
