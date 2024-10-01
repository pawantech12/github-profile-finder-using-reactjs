import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchRepoContent, fetchLatestCommits } from "../helper/GithubService";
import { FaArrowLeftLong, FaFolder, FaRegFile } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

// File extension to language mapping
const extensionToLanguageMap = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  html: "html",
  css: "css",
  json: "json",
  md: "markdown",
  py: "python",
  rb: "ruby",
  java: "java",
  php: "php",
  xml: "xml",
  sh: "bash",
  yml: "yaml",
  yaml: "yaml",
};

const RepoFileList = () => {
  const { username, repoName } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [commitMessages, setCommitMessages] = useState({});

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const filesData = await fetchRepoContent(username, repoName, currentPath);
      setFiles(filesData);

      // Fetch latest commit messages for files
      const commitMap = {};
      for (const file of filesData) {
        if (file.type === "file") {
          const latestCommit = await fetchLatestCommits(
            username,
            repoName,
            file.path
          );
          commitMap[file.sha] = latestCommit;
        } else if (file.type === "dir") {
          // For folders, get files inside the folder to fetch commits
          const folderFiles = await fetchRepoContent(
            username,
            repoName,
            `${currentPath}/${file.name}`
          );
          const latestCommitsInFolder = await Promise.all(
            folderFiles.map(async (folderFile) => {
              return await fetchLatestCommits(
                username,
                repoName,
                folderFile.path
              );
            })
          );
          // Find the latest commit message from the folder's files
          const latestCommitMessage = latestCommitsInFolder
            .filter(Boolean)
            .pop(); // Get the last truthy value
          commitMap[file.sha] = latestCommitMessage; // Store the latest commit message for the folder
        }
      }
      setCommitMessages(commitMap);
      setLoading(false);
    };

    fetchFiles();
  }, [username, repoName, currentPath]);

  const handleFolderClick = (folderName) => {
    setCurrentPath((prevPath) =>
      prevPath ? `${prevPath}/${folderName}` : folderName
    );
  };

  const handleFileClick = async (fileUrl, fileName) => {
    setLoading(true);

    const fileExtension = fileName.split(".").pop().toLowerCase();
    const language = extensionToLanguageMap[fileExtension] || "plaintext";

    const response = await fetch(fileUrl);
    const content = await response.text();

    navigate("/file-viewer", {
      state: { fileContent: content, fileName, fileLanguage: language },
    });

    setLoading(false);
  };

  const handleGoBack = () => {
    const pathArray = currentPath.split("/");
    pathArray.pop();
    setCurrentPath(pathArray.join("/"));
  };

  // Separate folders and files for rendering
  const folders = files.filter((file) => file.type === "dir");
  const fileItems = files.filter((file) => file.type === "file");

  return (
    <div className="bg-white p-4 mx-auto w-full">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      ) : (
        <>
          <div className="px-24 mt-20">
            <h2 className="text-2xl font-bold mb-4">Repository Files</h2>

            {/* List folders first */}
            {currentPath && (
              <button
                onClick={handleGoBack}
                className="text-gray-700 flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-md"
              >
                <FaArrowLeftLong />
                Go Back
              </button>
            )}
            <div className="mt-8">
              <ul>
                {/* Render folders first */}
                {folders.length > 0 && (
                  <>
                    {folders.map((folder) => (
                      <li
                        key={folder.sha}
                        className="py-2 flex justify-between items-center border-t "
                      >
                        <div className="flex items-center">
                          <button
                            onClick={() => handleFolderClick(folder.name)}
                            className="text-gray-700 hover:underline flex items-center gap-2 text-sm"
                          >
                            <FaFolder className="text-gray-500 w-4 h-4" />
                            {folder.name}
                          </button>
                        </div>
                        <span className="text-gray-500 ml-2 text-sm">
                          {commitMessages[folder.sha] || "No commit message"}
                        </span>
                      </li>
                    ))}
                  </>
                )}

                {/* Render files */}
                {fileItems.length > 0 && (
                  <>
                    {fileItems.map((file) => (
                      <li
                        key={file.sha}
                        className="py-2 flex justify-between items-center border-t "
                      >
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              handleFileClick(file.download_url, file.name)
                            }
                            className="text-gray-700 hover:underline flex items-center gap-2 text-sm"
                          >
                            <FaRegFile className="text-gray-500 w-4 h-4" />
                            {file.name}
                          </button>
                        </div>
                        <span className="text-gray-500 ml-2 text-sm">
                          {commitMessages[file.sha] || "No commit message"}
                        </span>
                      </li>
                    ))}
                  </>
                )}

                {/* If no files or folders are found */}
                {folders.length === 0 && fileItems.length === 0 && (
                  <p>No files found.</p>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RepoFileList;
