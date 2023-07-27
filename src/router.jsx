import { createBrowserRouter } from "react-router-dom";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        errorElement: <h1>There has been an error</h1>,
        children: [
          // { index: true, element: <Home /> },
          /* {
            path: "manage-owners",
            element: <ManageOwners />,
          },
          {
            path: "transfer-requests",
            children: [
              { index: true, element: <TransferRequests /> },
              { path: ":transferId", ...transferRoute },
            ],
          }, */
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
