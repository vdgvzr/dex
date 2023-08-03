import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dex from "./pages/Dex";
import Wallet from "./pages/Wallet";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Error from "./pages/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        errorElement: <Error />,
        children: [
          { index: true, element: <Home /> },
          {
            path: "admin",
            element: <Admin />,
          },
          {
            path: "trade",
            element: <Dex />,
          },
          {
            path: "wallet",
            element: <Wallet />,
          },
          { path: "*", element: <h1>Page not found</h1> },
        ],
      },
    ],
  },
]);

export const PAGES = [];

router.routes[0].children[0].children.map((page) => {
  if (page.path && page.path != "*") {
    let newPath = [];
    page.path != undefined &&
      page.path.split("-").forEach((segment) => {
        const capitalise = segment[0].toUpperCase() + segment.substr(1);
        newPath.push(capitalise);
      });
    PAGES.push({ name: newPath.join(" "), url: "/" + page.path });
  }
});
