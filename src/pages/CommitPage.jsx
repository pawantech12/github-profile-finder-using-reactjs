import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns"; // Import date-fns functions
import { fetchAllCommits } from "../helper/GithubService";

const CommitPage = () => {
  const { username, repoName, filePath } = useParams();
  const navigate = useNavigate();
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-gray-50 p-6 mx-auto w-full max-w-4xl">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      ) : (
        <div className="px-6">
          <button
            onClick={handleGoBack}
            className="mb-4 text-blue-600 hover:underline"
          >
            Back to Repo
          </button>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
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
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">
                    {date}
                  </h3>
                  <div className="border-l-2 border-gray-300 pl-4">
                    {commits.map((commit) => (
                      <div key={commit.sha} className="relative mb-6">
                        <div className="absolute left-[-10px] w-full h-[2px] bg-gray-300 top-1/2 transform -translate-y-1/2"></div>
                        <div className="relative ml-6">
                          <div className="h-1 w-10 bg-gray-300 absolute top-1/2 transform -translate-y-1/2 left-0"></div>
                          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 relative z-10">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-800 font-medium">
                                {commit.commit.author.name}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {formatDistanceToNow(
                                  new Date(commit.commit.committer.date),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-1">
                              {commit.commit.message}
                            </p>
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
