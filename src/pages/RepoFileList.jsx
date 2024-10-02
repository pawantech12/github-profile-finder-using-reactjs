import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchRepoContent, fetchLatestCommits } from "../helper/GithubService";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypePrettyCode from "rehype-pretty-code";

import {
  FaArrowLeftLong,
  FaCode,
  FaCodeBranch,
  FaFolder,
  FaLink,
  FaRegFile,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoIosTimer } from "react-icons/io";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { GoFileZip } from "react-icons/go";
import axios from "axios";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { LiaReadme } from "react-icons/lia";

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
  const [totalCommits, setTotalCommits] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("https");
  const location = useLocation();
  const { repo } = location.state;
  console.log("Repo details ", repo);
  const [copied, setCopied] = useState(false); // State to show the copied message
  const [readmeContent, setReadmeContent] = useState("");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true); // Show "Copied" message
    setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
  };
  const handleDownload = () => {
    const downloadUrl = `https://github.com/${username}/${repoName}/archive/refs/heads/${repo.default_branch}.zip`;
    window.open(downloadUrl, "_blank");
  };

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
    const fetchReadme = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${username}/${repoName}/readme`,
          {
            headers: {
              // Accept: "application/vnd.github.v3.raw", // To get the raw content
              Authorization: `token ${
                import.meta.env.VITE_APP_GITHUB_ACCESS_TOKEN
              }`,
            },
          }
        );
        setReadmeContent(response.data);
      } catch (error) {
        console.error("Error fetching README:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();

    const fetchCommits = async () => {
      const totalCommits = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/commits`,
        {
          headers: {
            Authorization: `token ${
              import.meta.env.VITE_APP_GITHUB_ACCESS_TOKEN
            }`,
          },
        }
      );
      const commits = await totalCommits.json();
      console.log("commit info", commits);

      setTotalCommits(commits);
    };
    fetchCommits();

    fetchFiles();
  }, [username, repoName, currentPath]);

  const handleFolderClick = (folderName) => {
    setCurrentPath((prevPath) =>
      prevPath ? `${prevPath}/${folderName}` : folderName
    );
  };
  console.log("totalcommits", totalCommits);

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
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const readmeFileContent = async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeDocument, { title: "README" })
        .use(rehypeFormat)
        .use(rehypeStringify)
        .use(rehypePrettyCode, {
          theme: "one-dark-pro",
          transformers: [
            transformerCopyButton({
              visibility: "always",
              feedbackDuration: 3_000,
            }),
          ],
        });

      const htmlContent = (await processor.process(readmeContent)).toString();
      setHtmlContent(htmlContent);
    };

    if (readmeContent) {
      readmeFileContent();
    }
  }, [readmeContent]);

  console.log("commitMessages", commitMessages.length);
  console.log("readme content", readmeContent);

  return (
    <div className="bg-white p-4 mx-auto w-full">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      ) : (
        <>
          <div className="px-24 mt-20">
            <h2 className="text-2xl font-bold mb-4">{repoName}</h2>

            <p className="text-sm text-gray-600">{repo?.description}</p>
            <Link
              to={repo?.homepage}
              target="_blank"
              className="flex items-center gap-1 hover:text-blue-400 text-sm mt-2"
            >
              <FaLink className="text-gray-600 w-4 h-4" />
              {repo?.homepage}
            </Link>
            <ul className="flex items-center gap-2 mt-3">
              {repo?.topics.map((topic) => (
                <li
                  key={topic}
                  className="text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-md"
                >
                  {topic}
                </li>
              ))}
            </ul>

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
            <div className="relative flex justify-between items-center mt-8">
              <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-md">
                <FaCodeBranch className="w-4 h-4 text-gray-600" />
                {repo.default_branch}
              </button>
              <button
                className="flex items-center gap-1 text-white bg-emerald-500 border text-sm border-emerald-500 rounded-md px-3 py-1"
                onClick={() => setIsOpen(!isOpen)}
              >
                <FaCode />
                Code
              </button>
              {isOpen && (
                <div
                  className="absolute right-0 top-10 w-96 bg-white rounded-xl border border-gray-200 py-2 px-3"
                  data-aos="ease-in-out"
                >
                  <div className="mt-3">
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-3">
                      <button
                        className={`rounded-t-md transition-all px-2 ease-in-out text-sm duration-200 text-center py-1 cursor-pointer ${
                          activeTab === "https"
                            ? "bg-blue-400 text-white "
                            : "bg-gray-200 text-neutral-800 "
                        }`}
                        onClick={() => setActiveTab("https")}
                      >
                        HTTPS
                      </button>

                      <button
                        className={`rounded-t-md transition-all ease-in-out duration-200 text-center py-1 text-sm px-2 cursor-pointer  ${
                          activeTab === "ssh"
                            ? "bg-blue-400 text-white"
                            : "bg-gray-200 text-neutral-800"
                        }`}
                        onClick={() => setActiveTab("ssh")}
                      >
                        SSH
                      </button>
                      <button
                        className={`rounded-t-md transition-all ease-in-out duration-200 text-center py-1 text-sm px-2 cursor-pointer  ${
                          activeTab === "cli"
                            ? "bg-blue-400 text-white"
                            : "bg-gray-200 text-neutral-800"
                        }`}
                        onClick={() => setActiveTab("cli")}
                      >
                        Github Cli
                      </button>
                    </div>
                    <hr />
                    {/* Content Area */}
                    <div className="mt-3 relative">
                      {activeTab === "https" ? (
                        <div className="w-full">
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              readOnly
                              value={repo.clone_url}
                              className="w-full border border-gray-200 rounded-md px-2 py-2 text-xs outline-none"
                            />
                            <button
                              className="w-10"
                              onClick={() => handleCopy(repo.clone_url)} // Copy HTTPS URL
                            >
                              <MdContentCopy />
                            </button>
                          </div>
                          <span className="text-xs text-gray-500">
                            Clone using the web URL.
                          </span>
                        </div>
                      ) : activeTab === "ssh" ? (
                        <div className="w-full">
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              readOnly
                              value={repo.ssh_url}
                              className="w-full border border-gray-200 rounded-md px-2 py-2 text-xs outline-none"
                            />
                            <button
                              className="w-10"
                              onClick={() => handleCopy(repo.ssh_url)} // Copy SSH URL
                            >
                              <MdContentCopy />
                            </button>
                          </div>
                          <span className="text-xs text-gray-500">
                            Use a password-protected SSH key.
                          </span>
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              readOnly
                              value={`gh repo clone ${username}/${repoName}`}
                              className="w-full border border-gray-200 rounded-md px-2 py-2 text-xs outline-none"
                            />
                            <button
                              className="w-10"
                              onClick={() =>
                                handleCopy(
                                  `gh repo clone ${username}/${repoName}`
                                )
                              } // Copy CLI command
                            >
                              <MdContentCopy />
                            </button>
                          </div>
                          <span className="text-xs text-gray-500">
                            Work fast with our official CLI.
                          </span>
                        </div>
                      )}

                      {/* Display popup when copied */}
                      {copied && (
                        <div className="absolute -top-9 -right-3 mt-2 mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md">
                          Copied!
                        </div>
                      )}
                    </div>
                  </div>
                  <hr className="my-3" />
                  <button
                    className="flex items-center gap-1 w-full px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                    onClick={handleDownload}
                  >
                    <GoFileZip className="w-4 h-4 text-gray-600" />
                    Download ZIP
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-200 rounded-t-md mt-4">
              {totalCommits && totalCommits.length > 0 ? (
                <div className="flex items-center gap-2">
                  <figure>
                    <img
                      src={totalCommits[0]?.author?.avatar_url}
                      alt="commit user profile image"
                      className="w-6 h-6 rounded-full"
                    />
                  </figure>
                  <span className="text-sm">
                    {totalCommits[0]?.author?.login}
                  </span>
                </div>
              ) : (
                <div>No commits found.</div>
              )}
              <span className="text-sm flex items-center gap-1 bg-white text-gray-700 px-3 py-1 rounded-md">
                <IoIosTimer className="w-5 h-5" />
                {totalCommits?.length || 0} commits
              </span>
            </div>
            <div className="border border-gray-200 px-4 rounded-b-md">
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
            <div className="w-full mt-5 border border-gray-200 rounded-md">
              <div className="px-4 py-3 flex items-center gap-1">
                <LiaReadme className="w-5 h-5" />
                <span className="uppercase text-sm">readme</span>
              </div>
              <hr />
              <div className="px-8 py-12">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: htmlContent || "" }}
                ></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RepoFileList;
