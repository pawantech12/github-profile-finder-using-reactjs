
# GitHub Profile Finder 🔍

A responsive GitHub Profile Finder that allows users to easily explore GitHub profiles, repositories, and contributions using the GitHub API. This application offers an intuitive interface to navigate user profiles, repositories, files, and commits, while also providing download options and syntax highlighting for files.



## Live Demo

[Live Demo](https://github-profile-finder-using-reactjs.vercel.app/)


## Features 🚀

- **User Profile with Contribution Chart**: Visualize a user's GitHub activity, including contributions, repositories, and recent events.
- **Repository Listing**: Explore all public repositories of a user, along with metadata such as stars, forks, and descriptions.
- **Repository Detail Page**:
  - View repository-specific information, tags, folders, and files.
  - Fetch and display README.md content.
  - Syntax-highlighted file viewer for displaying code files based on their extensions.
  - Download repository as a ZIP file.
  - Display repository’s HTTPS clone URL, SSH URL, and GitHub CLI command with a convenient "Copy" button.
- **File Viewer**:
  - Download individual files or copy file contents.
  - Syntax highlighting for different file types (e.g., .js, .html, .md).
  - Commit Timeline Page: View the repository's commit history with SHA information and a "Copy" button for quick access.
  - Total Number of Commits: Displays the total number of commits made in a selected repository.
  - Fully Responsive UI: Built with a mobile-first approach using TailwindCSS, ensuring seamless experience across devices.


## Tech Stack

- **ReactJS**: For building the dynamic and interactive user interface.
- **Vite**: Lightning-fast development and build tool.
- **TailwindCSS**: A utility-first CSS framework for quick and efficient styling.
- **GitHub API**: Fetches GitHub user data, repositories, commits, and more.
- **Vercel**: Hosting platform for the live demo of this application.## Installation

To run this project locally, follow these steps:
#### 1. Clone the Repository:

```bash
  git clone https://github.com/pawantech12/github-profile-finder-using-reactjs.git
```

#### 2. Navigate to  Directory:

```bash
  cd github-profile-finder-using-reactjs
```

#### 3. Install Dependencies:

```bash
  npm install or npm i
  (or `yarn install` if you prefer Yarn)
```

#### 4. Set up Github API Key:
- Create a `.env` file in the root directory.
- Add your Github API key in the following format:

```bash
VITE_APP_GITHUB_ACCESS_TOKEN=your_github_access_token
```

(You can generate a GitHub token from your GitHub account settings for accessing the GitHub API.)

#### 5. Start the development server:

```bash
  npm run dev (or `yarn dev`)
```

This will usually start the server on http://localhost:5173 by default.## Contributions 🤝

Contributions are welcome! If you'd like to improve the app, feel free to fork the repository and submit a pull request. You can also open issues for any bugs or feature requests.

## License 📄

This project is free to use and does not include any licensing restrictions. Feel free to modify, distribute, and use it for your personal or professional projects.

Enjoy exploring GitHub profiles with this powerful tool!
