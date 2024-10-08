import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import RepoFileList from "./pages/RepoFileList.jsx";
import FileViewer from "./pages/FileViewer.jsx";
import CommitPage from "./pages/CommitPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/repos/:username/:repoName",
    element: <RepoFileList />,
  },
  {
    path: "/repos/:username/:repoName/commits/:filePath?",
    element: <CommitPage />,
  },
  {
    path: "/file-viewer",
    element: <FileViewer />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
