import axios from "axios";

const API_BASE_URL = "https://api.github.com";
const token = import.meta.env.VITE_APP_GITHUB_ACCESS_TOKEN;
export const fetchUserProfile = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${username}`, {
      headers: {
        Authorization: `token ${token}`, // Include token in headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile", error);
  }
};

export const fetchUserRepos = async (username) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/${username}/repos`,
      {
        headers: {
          Authorization: `token ${token}`, // Include token in headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user repositories", error);
  }
};

export const fetchRepoContent = async (username, repo, path = "") => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/repos/${username}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${token}`, // Include token in headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching repo content:", error);
  }
};

// In GithubService.js

export const fetchLatestCommits = async (username, repoName, filePath) => {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repoName}/commits?path=${filePath}`,
    {
      headers: {
        Authorization: `token ${token}`, // Include token in headers
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch commits for the file");
  }
  const commits = await response.json();
  return commits.length > 0 ? commits[0].commit.message : null; // Return the latest commit message or null if none
};

export const fetchAllCommits = async (username, repoName) => {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repoName}/commits`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const fetchUserContributions = async (username) => {
  try {
    const reposResponse = await axios.get(
      `${API_BASE_URL}/users/${username}/repos`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );

    const repositories = reposResponse.data;

    // Prepare an object to count contributions by date
    const contributionsByDate = {};

    for (const repo of repositories) {
      const commitsResponse = await axios.get(
        `${API_BASE_URL}/repos/${username}/${repo.name}/commits?author=${username}`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );

      const commits = commitsResponse.data;

      // Count contributions by date
      commits.forEach((commit) => {
        const date = commit.commit.author.date.split("T")[0]; // Get date only
        contributionsByDate[date] = (contributionsByDate[date] || 0) + 1; // Increment count
      });
    }

    // Convert contributionsByDate object to an array
    const contributions = Object.entries(contributionsByDate).map(
      ([date, count]) => ({ date, count })
    );

    // Sort contributions by date
    contributions.sort((a, b) => new Date(a.date) - new Date(b.date));

    return contributions; // Return the formatted contributions
  } catch (error) {
    console.error("Error fetching user contributions", error);
    return []; // Return an empty array in case of error
  }
};
