import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { fetchAllCommits } from "../helper/GithubService";
import { FaCopy } from "react-icons/fa";
import Tooltip from "../components/Tooltip";

const CommitPage = () => {
  const { username, repoName, filePath } = useParams();
  const navigate = useNavigate();
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltipText, setTooltipText] = useState("Copy full SHA");

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const commitsData = await fetchAllCommits(username, repoName, filePath);
        setCommits(commitsData);
      } catch (error) {
        console.error("Error fetching commits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [username, repoName, filePath]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCopySHA = (sha) => {
    navigator.clipboard.writeText(sha);
    setTooltipText("Copied");
    setTimeout(() => setTooltipText("Copy full SHA"), 2000);
  };

  return (
    <div className="bg-gray-50 py-4 mx-auto w-full">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      ) : (
        <div className="px-6">
          <button
            onClick={handleGoBack}
            className="mb-4 text-blue-600 hover:underline max-[516px]:text-sm"
          >
            Back to Repo
          </button>
          <h2 className="text-3xl max-[516px]:text-xl font-bold mb-4 text-gray-800">
            Commits for <span className="text-blue-600">{repoName}</span>
          </h2>

          {commits.length === 0 ? (
            <p className="text-gray-600">No commits found.</p>
          ) : (
            <div className="relative">
              {Object.entries(
                commits.reduce((acc, commit) => {
                  const commitDate = format(
                    new Date(commit.commit.committer.date),
                    "MMMM d, yyyy"
                  );
                  if (!acc[commitDate]) acc[commitDate] = [];
                  acc[commitDate].push(commit);
                  return acc;
                }, {})
              ).map(([date, commits]) => (
                <div key={date} className="mb-8">
                  <h3 className="text-xl max-[516px]:text-sm font-semibold mt-4 mb-2 text-gray-700">
                    {date}
                  </h3>
                  <div className="border-l-2 border-gray-300 pl-4">
                    {commits.map((commit) => (
                      <div key={commit.sha} className="relative mb-6">
                        <div className="absolute left-[-10px] w-full h-[2px] bg-gray-300 top-1/2 transform -translate-y-1/2"></div>
                        <div className="relative ml-6">
                          <div className="h-1 w-10 bg-gray-300 absolute top-1/2 transform -translate-y-1/2 left-0"></div>
                          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 relative z-10">
                            <div className="flex items-center justify-between max-[516px]:flex-col max-[516px]:items-start max-[516px]:gap-2">
                              <p className="text-gray-600 font-semibold mt-1">
                                {commit.commit.message}
                              </p>
                              <div className="flex items-center gap-3">
                                {commit.commit.verification.verified ? (
                                  <span className="text-emerald-400 border-2 border-emerald-400 font-semibold px-2 py-1 rounded-md text-sm max-[516px]:text-xs max-[516px]:px-1">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="text-gray-500 font-semibold border-2 border-gray-200 px-2 py-1 rounded-md text-sm max-[516px]:text-xs max-[516px]:px-1">
                                    Unverified
                                  </span>
                                )}
                                <span className="text-sm max-[516px]:text-xs">
                                  {commit.sha.slice(0, 7)}
                                </span>
                                <Tooltip text={tooltipText}>
                                  <button
                                    className=""
                                    onClick={() => handleCopySHA(commit.sha)}
                                  >
                                    <FaCopy className="text-gray-500 hover:text-gray-800 cursor-pointer max-[516px]:text-xs" />
                                  </button>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <figure>
                                  <img
                                    src={commit.author.avatar_url}
                                    alt="avatar image"
                                    className="w-5 h-5 rounded-full"
                                  />
                                </figure>
                                <span className="text-gray-800 font-medium text-xs">
                                  {commit.author.login}
                                </span>
                              </div>
                              <span className="text-gray-500 text-sm max-[516px]:text-xs">
                                {formatDistanceToNow(
                                  new Date(commit.commit.committer.date),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommitPage;
