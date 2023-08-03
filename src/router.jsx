import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dex from "./pages/Dex";
import Wallet from "./pages/Wallet";
import Admin from "./pages/Admin";
import Static from "./pages/Static";
import { mainSiteCopy } from "../src/assets/copy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        errorElement: (
          <Static pageType="error" title="Error - Something went wrong" />
        ),
        children: [
          {
            index: true,
            element: (
              <Static
                pageType="home"
                title={`Welcome to ${import.meta.env.VITE_SITE_NAME}`}
                copy={mainSiteCopy}
                buttonText={"Start Trading Now"}
              />
            ),
          },
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
          {
            path: "*",
            element: (
              <Static
                pageType="404"
                title="404 - page not found"
                copy="You have entered an incorrect destination, please try again"
                buttonText="Home"
              />
            ),
          },
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
