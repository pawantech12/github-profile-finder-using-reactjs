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

// Updated fetchLatestCommits to use axios
export const fetchAllCommits = async (username, repoName, filePath) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}/commits`,
      {
        params: { path: filePath },
        headers: {
          Authorization: `token ${token}`, // Include token in headers
        },
      }
    );
    return response.data.length > 0 ? response.data : []; // Return the list of commits or an empty array if none
  } catch (error) {
    console.error("Error fetching commits:", error);
    throw error; // Rethrow to handle it in the component
  }
};
